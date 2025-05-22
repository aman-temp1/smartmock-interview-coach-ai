
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Logo from "@/components/ui/Logo";
import { useToast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a mock login for demonstration purposes
    if (email && password) {
      toast({
        title: "Successfully logged in",
        description: "Welcome back to SmartMock!",
      });
      navigate("/");
    } else {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
    }
  };

  // Simpler login for demo purposes
  const handleDemoLogin = () => {
    toast({
      title: "Demo mode activated",
      description: "You're now using SmartMock as a demo user",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
      <div className="w-full max-w-md p-8 bg-background rounded-lg shadow-sm border border-border">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">Log in to your account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-sm text-brand-600 hover:text-brand-500">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm font-normal">
              Remember me for 30 days
            </Label>
          </div>
          
          <Button type="submit" className="w-full gradient-bg">
            Sign in
          </Button>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-3">
            <Button variant="outline" type="button" onClick={handleDemoLogin}>
              Try Demo Mode
            </Button>
          </div>
        </div>
        
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-brand-600 hover:text-brand-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
