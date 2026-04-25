import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, Upload, X, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

const AMENITIES_LIST = [
  "WiFi",
  "Parking",
  "Air Conditioning",
  "Kitchen",
  "TV",
  "Sound System",
  "Green Screen",
  "Lighting Equipment",
];

const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().min(3, "Location is required"),
  price_per_night: z.number().min(1, "Price must be greater than 0"),
  space_type: z.string().min(1, "Space type is required"),
  max_guests: z.number().min(1, "At least 1 guest required"),
  bedrooms: z.number().min(1, "At least 1 bedroom required"),
  bathrooms: z.number().min(1, "At least 1 bathroom required"),
  available_from: z.date().optional(),
  available_to: z.date().optional(),
  amenities: z.array(z.string()).default([]),
  // Images are handled separately from the form validation
});

type ListingFormData = z.infer<typeof listingSchema>;

const ListSpace = () => {
  const { user, loading } = useAuthState();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      max_guests: 1,
      bedrooms: 1,
      bathrooms: 1,
      amenities: [],
    },
  });

  // Fetch listing data if in edit mode
  useEffect(() => {
    if (!id || !user) return;

    const fetchListing = async () => {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data.user_id !== user.id) {
          toast({
            title: "Unauthorized",
            description: "You do not have permission to edit this listing.",
            variant: "destructive",
          });
          navigate('/host');
          return;
        }

        // Populate form
        form.reset({
          title: data.title,
          description: data.description || "",
          location: data.location,
          price_per_night: data.price_per_night,
          space_type: data.space_type,
          max_guests: data.max_guests,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          amenities: data.amenities || [],
          available_from: data.available_from ? new Date(data.available_from) : undefined,
          available_to: data.available_to ? new Date(data.available_to) : undefined,
        });

        // Set existing images
        if (data.images && Array.isArray(data.images)) {
          setExistingImages(data.images);
        }

      } catch (error) {
        console.error("Error fetching listing:", error);
        toast({
          title: "Error",
          description: "Failed to load listing details.",
          variant: "destructive",
        });
        navigate('/host');
      }
    };

    fetchListing();
  }, [id, user, navigate, toast, form]);

  // Redirect to auth if not logged in
  if (!loading && !user) {
    navigate('/auth');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const selectedFiles = Array.from(e.target.files || []);

    // Validate file types and sizes
    const invalidFiles = selectedFiles.filter(
      file => !ACCEPTED_IMAGE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE
    );

    if (invalidFiles.length > 0) {
      setUploadError(
        `Some files were not added: ${invalidFiles.length} file(s) exceed 5MB or are not in JPG, PNG, or GIF format.`
      );
      // Filter out invalid files
      const validFiles = selectedFiles.filter(
        file => ACCEPTED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE
      );
      addValidFiles(validFiles);
    } else {
      addValidFiles(selectedFiles);
    }
  };

  // Add valid files to state
  const addValidFiles = (files: File[]) => {
    if (files.length === 0) return;

    // Create object URLs for previews
    const newPreviews = files.map(file => URL.createObjectURL(file));

    setImages(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  // Remove an image (newly uploaded)
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index]);
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Remove an existing image (from database)
  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  // Upload images to Supabase Storage
  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return [];

    const imageUrls: string[] = [];

    for (const image of images) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${user!.id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('listing-images')
        .upload(filePath, image, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(filePath);

      imageUrls.push(publicUrl);
    }

    return imageUrls;
  };

  const onSubmit = async (data: ListingFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // First upload new images
      const newImageUrls = await uploadImages();

      // Combine existing images (that weren't removed) with new uploads
      const finalImages = [...existingImages, ...newImageUrls];

      const listingData = {
        user_id: user.id,
        title: data.title,
        description: data.description || null,
        location: data.location,
        price_per_night: data.price_per_night,
        space_type: data.space_type,
        max_guests: data.max_guests,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        available_from: data.available_from ? format(data.available_from, 'yyyy-MM-dd') : null,
        available_to: data.available_to ? format(data.available_to, 'yyyy-MM-dd') : null,
        amenities: data.amenities,
        images: finalImages.length > 0 ? finalImages : null,
      };

      if (id) {
        // Update existing listing
        const { error } = await supabase
          .from('listings')
          .update(listingData)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Success!",
          description: "Your space has been updated successfully.",
        });
        navigate('/host');
      } else {
        // Create new listing
        const { error } = await supabase
          .from('listings')
          .insert(listingData);

        if (error) throw error;

        toast({
          title: "Success!",
          description: "Your space has been listed successfully.",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error saving listing:', error);
      toast({
        title: "Error",
        description: `Failed to ${id ? 'update' : 'create'} listing. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div> */}

          <div className="bg-card rounded-lg shadow-sm border p-8">
            <h1 className="text-3xl font-bold mb-2">{id ? 'Edit Your Space' : 'List Your Space'}</h1>
            <p className="text-muted-foreground mb-8">
              {id ? 'Update your listing details and manage your space.' : 'Share your space with travelers and start earning today.'}
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Beautiful downtown apartment" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your space, amenities, and what makes it special..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="New York, NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="space_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Space Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select space type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Gaming Room">Gaming Room</SelectItem>
                            <SelectItem value="Podcast Studio">Podcast Studio</SelectItem>
                            <SelectItem value="Art Studio">Art Studio</SelectItem>
                            <SelectItem value="Meeting Room">Meeting Room</SelectItem>
                            <SelectItem value="Music Studio">Music Studio</SelectItem>
                            <SelectItem value="Photo Studio">Photo Studio</SelectItem>
                            <SelectItem value="Fitness Space">Fitness Space</SelectItem>
                            <SelectItem value="Study Room">Study Room</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="price_per_night"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price/Night ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="max_guests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Guests</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="available_from"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Available From (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="available_to"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Available To (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="amenities"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Amenities</FormLabel>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {AMENITIES_LIST.map((amenity) => (
                          <FormField
                            key={amenity}
                            control={form.control}
                            name="amenities"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={amenity}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(amenity)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, amenity])
                                          : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== amenity
                                            )
                                          )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {amenity}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload Section */}
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <FormLabel>Property Images</FormLabel>
                    <div className="flex items-center gap-4">
                      <label
                        htmlFor="image-upload"
                        className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-primary/50 rounded-md cursor-pointer hover:bg-primary/5 transition-colors"
                      >
                        <Upload className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">Upload Images</span>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/jpeg,image/png,image/gif"
                          multiple
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG or GIF (max. 5MB per image)
                      </p>
                    </div>
                    {uploadError && (
                      <p className="text-sm text-destructive mt-2">{uploadError}</p>
                    )}
                  </div>

                  {/* Image Previews */}
                  {(previews.length > 0 || existingImages.length > 0) && (
                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {/* Existing Images */}
                        {existingImages.map((url, index) => (
                          <div key={`existing-${index}`} className="relative group rounded-md overflow-hidden border border-border">
                            <img
                              src={url}
                              alt={`Existing ${index + 1}`}
                              className="h-24 w-full object-cover"
                            />
                            <div className="absolute top-0 left-0 bg-black/50 text-white text-xs px-2 py-1 rounded-br">Existing</div>
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="absolute top-1 right-1 bg-background/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </button>
                          </div>
                        ))}

                        {/* New Uploads */}
                        {previews.map((preview, index) => (
                          <div key={`new-${index}`} className="relative group rounded-md overflow-hidden border border-border">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="h-24 w-full object-cover"
                            />
                            <div className="absolute top-0 left-0 bg-green-500/80 text-white text-xs px-2 py-1 rounded-br">New</div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-background/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}

                  {previews.length === 0 && existingImages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-[100px] border border-dashed rounded-md bg-muted/30">
                      <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">No images selected</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? "Creating Listing..." : "List Your Space"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListSpace;