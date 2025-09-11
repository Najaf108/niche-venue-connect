import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Terms and Conditions
            </h1>
            <p className="text-muted-foreground text-lg">
              Last updated: December 2024
            </p>
          </header>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By accessing and using RentSpaces ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                RentSpaces is a platform that connects space owners ("Hosts") with individuals seeking to rent creative and professional spaces ("Guests"). 
                Our platform facilitates bookings for various space categories including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Gaming Rooms</li>
                <li>Podcast Studios</li>
                <li>Art Studios</li>
                <li>Meeting Rooms</li>
                <li>Music Studios</li>
                <li>Photo Studios</li>
                <li>Fitness Spaces</li>
                <li>Study Rooms</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. User Accounts and Registration</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To access certain features of the Platform, you must register and create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Keep your account credentials secure and confidential</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Host Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you list a space on our platform, you agree to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Provide accurate descriptions and photos of your space</li>
                <li>Ensure your space meets all safety and legal requirements</li>
                <li>Honor confirmed bookings and maintain availability calendars</li>
                <li>Treat guests with respect and professionalism</li>
                <li>Comply with local laws and regulations regarding space rental</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Guest Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When booking a space, you agree to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Use the space only for its intended purpose</li>
                <li>Treat the space and equipment with care</li>
                <li>Follow all house rules and guidelines provided by the host</li>
                <li>Report any damages or issues immediately</li>
                <li>Pay all fees and charges as agreed</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Booking and Payment</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All bookings are subject to host approval. Payment processing is handled securely through our platform. 
                Fees include the space rental cost plus applicable service fees. Cancellation policies vary by listing 
                and are clearly stated before booking confirmation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Privacy and Data Protection</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect and process personal information in accordance with our Privacy Policy. By using our services, 
                you consent to the collection and use of your information as described in our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Prohibited Activities</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Users are prohibited from:
              </p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Using the platform for illegal activities</li>
                <li>Posting false or misleading information</li>
                <li>Harassing or discriminating against other users</li>
                <li>Attempting to circumvent our booking and payment systems</li>
                <li>Violating intellectual property rights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                RentSpaces acts as a platform connecting hosts and guests. We are not responsible for the condition, 
                safety, or legality of listed spaces, the truth or accuracy of listings, or the ability of hosts to 
                provide spaces or guests to pay for them.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">10. Modifications to Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon 
                posting on the platform. Your continued use of the service constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">11. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-muted-foreground">Email: legal@rentspaces.com</p>
                <p className="text-muted-foreground">Phone: +1 (555) 123-4567</p>
                <p className="text-muted-foreground">Address: San Francisco, CA</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;