import { Gamepad2, Mic, Palette, Users, Music, Camera, Dumbbell, BookOpen } from "lucide-react";

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
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Browse by Category
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find the perfect space for your next project, meeting, or creative endeavor
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.name}
                className="group cursor-pointer bg-card rounded-xl p-6 hover:shadow-[var(--shadow-hover)] transition-all duration-300 transform hover:-translate-y-1 border border-border"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">{category.count}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;