
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Logo from "@/components/ui/logo";
import { useToast } from "@/components/ui/use-toast";

const SignupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a mock signup for demonstration purposes
    if (name && email && password) {
      toast({
        title: "Account created",
        description: "Welcome to SmartMock! Your account has been created successfully.",
      });
      navigate("/");
    } else {
      toast({
        title: "Error",
        description: "Please fill out all fields",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
      <div className="w-full max-w-md p-8 bg-background rounded-lg shadow-sm border border-border">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">Create your account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Must be at least 8 characters
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="text-sm font-normal">
              I agree to the{" "}
              <Link to="/terms" className="text-brand-600 hover:text-brand-500">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-brand-600 hover:text-brand-500">
                Privacy Policy
              </Link>
            </Label>
          </div>
          
          <Button type="submit" className="w-full gradient-bg">
            Create Account
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
            <Button variant="outline" type="button" onClick={() => navigate("/")}>
              Try Demo Mode
            </Button>
          </div>
        </div>
        
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
