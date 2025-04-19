import axios from "axios";
import { toast } from "@/hooks/use-toast";

// Type definitions
interface ApiError {
  message: string;
  status?: number;
}

// User interface
interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Auth response interfaces
interface LoginResponse {
  token: string;
  user: User;
}

interface UserResponse {
  user: User;
}

// Type guard to check if APP_CONFIG exists and has correct structure
function isValidAppConfig(config: unknown): config is Window["APP_CONFIG"] {
  return (
    config !== null &&
    typeof config === "object" &&
    "API_URL" in config &&
    typeof (config as { API_URL: unknown }).API_URL === "string"
  );
}

// Safely get API URL from window.APP_CONFIG
const getApiUrl = (): string => {
  if (
    typeof window !== "undefined" &&
    window.APP_CONFIG &&
    isValidAppConfig(window.APP_CONFIG)
  ) {
    return window.APP_CONFIG.API_URL;
  }
  return "http://localhost:5000/api";
};

// Base API configuration
const api = axios.create({
  baseURL: getApiUrl(),
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
    api.post<LoginResponse>("/auth/login", { email, password }),

  register: (name: string, email: string, password: string) =>
    api.post<LoginResponse>("/auth/register", {
      name,
      email,
      password,
    }),

  getCurrentUser: () => api.get<UserResponse>("/auth/me"),

  logout: () => {
    localStorage.removeItem("noteflow_token");
    localStorage.removeItem("noteflow_user");
  },
};

// Note type definition
interface Note {
  _id: string;
  title: string;
  content: string;
  category?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  user: string;
}

// Notes API
export const notesAPI = {
  getAllNotes: () => api.get<Note[]>("/notes"),

  getNoteById: (id: string) => api.get<Note>(`/notes/${id}`),

  createNote: (noteData: {
    title: string;
    content: string;
    category?: string;
    color?: string;
  }) => api.post<Note>("/notes", noteData),

  updateNote: (
    id: string,
    noteData: {
      title?: string;
      content?: string;
      category?: string;
      color?: string;
    }
  ) => api.put<Note>(`/notes/${id}`, noteData),

  deleteNote: (id: string) => api.delete(`/notes/${id}`),

  // Category methods
  getAllCategories: () => api.get<string[]>("/categories"),

  createCategory: (name: string) =>
    api.post<{ name: string }>("/categories", { name }),

  deleteCategory: (name: string) => api.delete(`/categories/${name}`),
};

export default api;
