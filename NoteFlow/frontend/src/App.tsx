
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotesProvider } from "@/contexts/NotesContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import AllNotesPage from "./pages/AllNotesPage";
import NewNotePage from "./pages/NewNotePage";
import EditNotePage from "./pages/EditNotePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <NotesProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected routes */}
              <Route element={<AppLayout />}>
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/notes" 
                  element={
                    <ProtectedRoute>
                      <AllNotesPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/notes/new" 
                  element={
                    <ProtectedRoute>
                      <NewNotePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/notes/edit/:id" 
                  element={
                    <ProtectedRoute>
                      <EditNotePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/notes/:id" 
                  element={
                    <ProtectedRoute>
                      <NoteDetailPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/category/:category" 
                  element={
                    <ProtectedRoute>
                      <CategoryPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/search" 
                  element={
                    <ProtectedRoute>
                      <SearchPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  } 
                />
              </Route>
              
              {/* 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </NotesProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
