import { Gamepad2, Mic, Palette, Users, Music, Camera, Dumbbell, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  {
    name: "Gaming Rooms",
    icon: Gamepad2,
    count: "120+ spaces",
    color: "from-purple-500 to-blue-500",
  },
  {
    name: "Podcast Studios",
    icon: Mic,
    count: "85+ spaces",
    color: "from-green-500 to-teal-500",
  },
  {
    name: "Art Studios",
    icon: Palette,
    count: "95+ spaces",
    color: "from-orange-500 to-red-500",
  },
  {
    name: "Meeting Rooms",
    icon: Users,
    count: "200+ spaces",
    color: "from-blue-500 to-indigo-500",
  },
  {
    name: "Music Studios",
    icon: Music,
    count: "65+ spaces",
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "Photo Studios",
    icon: Camera,
    count: "75+ spaces",
    color: "from-yellow-500 to-orange-500",
  },
  {
    name: "Fitness Spaces",
    icon: Dumbbell,
    count: "45+ spaces",
    color: "from-emerald-500 to-green-500",
  },
  {
    name: "Study Rooms",
    icon: BookOpen,
    count: "110+ spaces",
    color: "from-slate-500 to-gray-500",
  },
];

const Categories = () => {
  return (
    <section className="py-24 bg-muted/20 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent skew-x-12 transform translate-x-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 reveal">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Explore Your <span className="text-primary tracking-tighter">Niche</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Find the perfect specialized environment designed for your specific creative or professional needs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.name}
                className={cn(
                  "group cursor-pointer bg-card rounded-3xl p-8 transition-smooth border border-border/50 hover:border-primary/30 hover:shadow-premium hover:-translate-y-2 reveal",
                  index === 0 && "reveal-delayed-1",
                  index === 1 && "reveal-delayed-2",
                  index === 2 && "reveal-delayed-3",
                  index >= 3 && "reveal-delayed-3"
                )}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg shadow-black/5`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground font-medium uppercase tracking-widest">
                  <span className="w-4 h-0.5 bg-primary/30 mr-2 group-hover:w-8 transition-all duration-500" />
                  {category.count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;