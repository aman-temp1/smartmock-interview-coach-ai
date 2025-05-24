
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Layouts
import MainLayout from "./components/layouts/MainLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/Auth/AuthPage";
import Dashboard from "./pages/Dashboard";
import InterviewsPage from "./pages/Interviews/InterviewsPage";
import NewInterviewPage from "./pages/Interviews/NewInterviewPage";
import InterviewSessionPage from "./pages/Interviews/InterviewSessionPage";
import FeedbackPage from "./pages/Interviews/FeedbackPage";
import ResumePage from "./pages/Resume/ResumePage";
import ResumeBuilderPage from "./pages/Resume/ResumeBuilderPage";
import ResumeTailorPage from "./pages/Resume/ResumeTailorPage";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="/interviews" element={<InterviewsPage />} />
              <Route path="/interviews/new" element={<NewInterviewPage />} />
              <Route path="/interviews/session" element={<InterviewSessionPage />} />
              <Route path="/interviews/feedback" element={<FeedbackPage />} />
              <Route path="/resume" element={<ResumePage />} />
              <Route path="/resume/builder" element={<ResumeBuilderPage />} />
              <Route path="/resume/tailor" element={<ResumeTailorPage />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
