import axios from "axios";
import { toast } from "@/hooks/use-toast";

// Base API configuration
const api = axios.create({
  baseURL: window.APP_CONFIG?.API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("noteflow_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    // Automatically handle 401 errors
    if (error.response?.status === 401) {
      localStorage.removeItem("noteflow_token");
      localStorage.removeItem("noteflow_user");
      window.location.href = "/login";
    }

    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  register: (name: string, email: string, password: string) =>
    api.post("/auth/register", { name, email, password }),

  getCurrentUser: () => api.get("/auth/me"),

  logout: () => {
    localStorage.removeItem("noteflow_token");
    localStorage.removeItem("noteflow_user");
  },
};

// Notes API
export const notesAPI = {
  getAllNotes: () => api.get("/notes"),

  getNoteById: (id: string) => api.get(`/notes/${id}`),

  createNote: (noteData: {
    title: string;
    content: string;
    category?: string;
    color?: string;
  }) => api.post("/notes", noteData),

  updateNote: (
    id: string,
    noteData: {
      title?: string;
      content?: string;
      category?: string;
      color?: string;
    }
  ) => api.put(`/notes/${id}`, noteData),

  deleteNote: (id: string) => api.delete(`/notes/${id}`),

  // Updated category methods to use the configured api instance
  getAllCategories: () => api.get("/categories"),

  createCategory: (name: string) => api.post("/categories", { name }),

  deleteCategory: (name: string) => api.delete(`/categories/${name}`),
};

export default api;
