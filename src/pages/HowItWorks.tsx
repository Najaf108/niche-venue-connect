import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, UserPlus, Calendar, MessageSquare, Shield, CreditCard } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Search & Discover",
      description: "Browse through our curated selection of creative spaces. Use filters by location, date, space type, and amenities to find your perfect match.",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: UserPlus,
      title: "Create Your Profile",
      description: "Sign up and create your profile. Verify your identity for secure bookings and add your preferences to get personalized recommendations.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Calendar,
      title: "Book Instantly",
      description: "Select your dates and book instantly or send a request to the host. Get immediate confirmation and receive detailed space information.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: MessageSquare,
      title: "Connect with Hosts",
      description: "Communicate directly with space owners through our messaging system. Ask questions, discuss requirements, and coordinate access details.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Shield,
      title: "Secure Experience",
      description: "Enjoy peace of mind with our verified hosts, secure payments, and comprehensive insurance coverage for every booking.",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: CreditCard,
      title: "Easy Payments",
      description: "Pay securely through our platform. Only charged when your booking is confirmed. Get receipts and manage all transactions in one place.",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const forHosts = [
    {
      title: "List Your Space",
      description: "Create a detailed listing with photos, description, amenities, and availability calendar."
    },
    {
      title: "Set Your Price",
      description: "Choose competitive hourly, daily, or monthly rates. Our dynamic pricing tool helps optimize your earnings."
    },
    {
      title: "Manage Bookings",
      description: "Accept or decline requests, communicate with guests, and manage your calendar all in one dashboard."
    },
    {
      title: "Get Paid Securely",
      description: "Receive payments automatically after each booking. Track your earnings and get detailed financial reports."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              How RentSpaces Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover unique creative spaces or earn money by sharing yours. Our platform makes it simple, 
              secure, and seamless for everyone.
            </p>
          </div>
        </section>

        {/* For Guests Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">For Space Seekers</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Find and book the perfect creative space for your next project in just a few clicks
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* For Hosts Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">For Space Owners</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Turn your unused space into a source of income and help creators bring their visions to life
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {forHosts.map((item, index) => (
                <div key={index} className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Space Categories Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Popular Space Categories</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From creative studios to professional meeting rooms, find spaces for every purpose
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Gaming Rooms", count: "120+ spaces", color: "from-purple-500 to-blue-500" },
                { name: "Podcast Studios", count: "85+ spaces", color: "from-green-500 to-teal-500" },
                { name: "Art Studios", count: "95+ spaces", color: "from-orange-500 to-red-500" },
                { name: "Meeting Rooms", count: "200+ spaces", color: "from-blue-500 to-indigo-500" },
                { name: "Music Studios", count: "65+ spaces", color: "from-pink-500 to-rose-500" },
                { name: "Photo Studios", count: "75+ spaces", color: "from-yellow-500 to-orange-500" },
                { name: "Fitness Spaces", count: "45+ spaces", color: "from-emerald-500 to-green-500" },
                { name: "Study Rooms", count: "110+ spaces", color: "from-slate-500 to-gray-500" }
              ].map((category, index) => (
                <div key={index} className="text-center p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow duration-300">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br ${category.color}`}></div>
                  <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Safety Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Trust & Safety</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Your security and peace of mind are our top priorities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Verified Hosts</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All hosts go through identity verification and background checks to ensure your safety.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Secure Payments</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All transactions are processed securely with industry-standard encryption and fraud protection.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">24/7 Support</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our customer support team is available around the clock to assist with any issues or questions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;