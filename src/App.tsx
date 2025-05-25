
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AudioProvider } from "@/contexts/AudioContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Layouts
import MainLayout from "./components/layouts/MainLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/Auth/AuthPage";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
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
      <AudioProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Root redirect - redirect to landing for unauthenticated users, dashboard for authenticated */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              } />

              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
              </Route>

              <Route path="/interviews" element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<InterviewsPage />} />
                <Route path="new" element={<NewInterviewPage />} />
                <Route path="session" element={<InterviewSessionPage />} />
                <Route path="feedback" element={<FeedbackPage />} />
              </Route>

              <Route path="/resume" element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<ResumePage />} />
                <Route path="builder" element={<ResumeBuilderPage />} />
                <Route path="tailor" element={<ResumeTailorPage />} />
              </Route>

              <Route path="/settings" element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Settings />} />
              </Route>

              {/* Catch-all route - redirect to landing for unauthenticated users */}
              <Route path="*" element={<Navigate to="/landing" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AudioProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
