import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/context/SearchContext";
import { FiltersSidebar } from "@/components/search/FiltersSidebar";
import ListingCard from "@/components/ListingCard";
import { cn } from "@/lib/utils";

const BrowseSpaces = () => {
  const { listings, loading, filters } = useSearch();

  return (
    <div className="min-h-screen bg-background bg-dot-pattern flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 flex flex-col">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Page Header */}
          <div className="mb-8 reveal">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Browse <span className="text-primary italic">Spaces</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {loading ? "Searching for spaces..." : `${listings.length} premium spaces found for you`}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Filters Sidebar */}
            <aside className="lg:w-80 flex-shrink-0 reveal-delayed-1">
              <div className="sticky top-28">
                <FiltersSidebar />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-card/50 backdrop-blur rounded-3xl h-[400px] animate-pulse border border-border/50" />
                  ))}
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-24 bg-card/30 backdrop-blur rounded-[3rem] border border-dashed border-border/50 reveal-delayed-2">
                  <div className="text-7xl mb-6">🏢</div>
                  <h3 className="text-3xl font-black mb-4 text-foreground">No spaces found</h3>
                  <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                    We couldn't find any spaces matching your criteria. Try adjusting your filters.
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-full px-8 h-12 font-bold"
                    onClick={() => window.location.reload()}
                  >
                    Clear Filter
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 transition-all duration-500">
                  {listings.map((listing, index) => (
                    <div
                      key={listing.id}
                      className={cn(
                        "reveal",
                        index % 3 === 0 && "reveal-delayed-1",
                        index % 3 === 1 && "reveal-delayed-2",
                        index % 3 === 2 && "reveal-delayed-3"
                      )}
                    >
                      <ListingCard
                        id={listing.id}
                        title={listing.title}
                        description={listing.description}
                        location={listing.location}
                        price={listing.price_per_night}
                        rating={listing.reviews && listing.reviews.length > 0
                          ? parseFloat((listing.reviews.reduce((acc, r) => acc + r.rating, 0) / listing.reviews.length).toFixed(1))
                          : 0
                        }
                        reviewCount={listing.reviews?.length || 0}
                        imageUrl={(listing.images && listing.images.length > 0) ? listing.images[0] : ""}
                        images={listing.images || []}
                        category={listing.space_type || "Space"}
                        amenities={listing.amenities || []}
                        hostName={listing.profiles?.display_name || "Verified Host"}
                        searchQuery={filters.location}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BrowseSpaces;
