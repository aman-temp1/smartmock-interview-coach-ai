
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./components/layouts/MainLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import Dashboard from "./pages/Dashboard";
import InterviewsPage from "./pages/Interviews/InterviewsPage";
import NewInterviewPage from "./pages/Interviews/NewInterviewPage";
import InterviewSessionPage from "./pages/Interviews/InterviewSessionPage";
import FeedbackPage from "./pages/Interviews/FeedbackPage";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/interviews" element={<InterviewsPage />} />
            <Route path="/interviews/new" element={<NewInterviewPage />} />
            <Route path="/interviews/session" element={<InterviewSessionPage />} />
            <Route path="/interviews/feedback" element={<FeedbackPage />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
