
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/ui/Logo";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/login')}>
              Log In
            </Button>
            <Button onClick={() => navigate('/signup')}>Sign Up</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Master Your Interviews with <span className="gradient-text">AI-Powered Practice</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Practice interviews with realistic AI interviewers that provide feedback and help you improve your skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/signup')} className="gradient-bg">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/demo')}>
                Try Demo
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/40">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Practice Any Interview Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Technical Interviews",
                  description: "Coding challenges, system design, and technical questions tailored to your experience level."
                },
                {
                  title: "Behavioral Interviews",
                  description: "STAR method questions to showcase your past experiences and accomplishments."
                },
                {
                  title: "Leadership Interviews",
                  description: "Management scenarios and team leadership questions for executive roles."
                }
              ].map((feature, index) => (
                <div key={index} className="bg-background rounded-lg p-6 shadow-sm border border-border">
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose SmartMock?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  title: "Human-like Conversations",
                  description: "Voice-based interactions that feel natural and realistic."
                },
                {
                  title: "Detailed Feedback",
                  description: "Get actionable insights on your performance after each practice session."
                },
                {
                  title: "Multiple Interviewer Personalities",
                  description: "Practice with different interviewer styles and approaches."
                },
                {
                  title: "Progress Tracking",
                  description: "Monitor your improvement over time with analytics and metrics."
                }
              ].map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 rounded-full bg-brand-100 p-2 mr-4">
                    <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-white">
                      ✓
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-brand-50 border-y border-border">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to Ace Your Next Interview?</h2>
            <Button size="lg" onClick={() => navigate('/signup')} className="gradient-bg">
              Start Practicing Now
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo />
            <p className="text-muted-foreground mt-4 md:mt-0">
              © 2025 SmartMock. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
