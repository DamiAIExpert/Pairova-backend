# Frontend Integration Guide for Pairova API

This guide provides comprehensive examples and best practices for integrating with the Pairova API from your frontend application.

## 🚀 Quick Start

### 1. Base Configuration

```typescript
// api/config.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://server.pairova.com' 
  : 'http://localhost:3000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};
```

### 2. Authentication Service

```typescript
// services/auth.service.ts
class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('access_token');
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    this.token = data.data.access_token;
    localStorage.setItem('access_token', this.token);
    localStorage.setItem('refresh_token', data.data.refresh_token);
    
    return data.data;
  }

  async logout() {
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getAuthHeaders() {
    return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
  }
}

export const authService = new AuthService();
```

## 📱 React Integration Examples

### 1. Authentication Hook

```typescript
// hooks/useAuth.ts
import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/auth.service';

interface User {
  id: string;
  email: string;
  role: 'APPLICANT' | 'NONPROFIT' | 'ADMIN';
  profile?: {
    firstName: string;
    lastName: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('access_token');
    if (token) {
      // Verify token and get user info
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: authService.getAuthHeaders(),
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
      } else {
        // Token is invalid, clear it
        authService.logout();
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      authService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isLoading,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 2. API Service with Error Handling

```typescript
// services/api.service.ts
class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      ...apiConfig.headers,
      ...authService.getAuthHeaders(),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          // Token expired, redirect to login
          authService.logout();
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }

        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Jobs API
  async getJobs(params?: { page?: number; limit?: number; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const query = queryParams.toString();
    return this.request(`/jobs${query ? `?${query}` : ''}`);
  }

  async getJob(id: string) {
    return this.request(`/jobs/${id}`);
  }

  async createJob(jobData: any) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async applyToJob(jobId: string, applicationData: any) {
    return this.request(`/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  // User Profile API
  async getUserProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData: any) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // File Upload API
  async uploadFile(file: File, type: 'resume' | 'document' | 'image') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request('/uploads', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }
}

export const apiService = new ApiService();
```

### 3. React Query Integration

```typescript
// hooks/useJobs.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api.service';

export const useJobs = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => apiService.getJobs(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useJob = (id: string) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => apiService.getJob(id),
    enabled: !!id,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (jobData: any) => apiService.createJob(jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useApplyToJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ jobId, applicationData }: { jobId: string; applicationData: any }) =>
      apiService.applyToJob(jobId, applicationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};
```

### 4. Job List Component

```typescript
// components/JobList.tsx
import React from 'react';
import { useJobs } from '../hooks/useJobs';
import { useAuth } from '../hooks/useAuth';

export const JobList: React.FC = () => {
  const { user } = useAuth();
  const { data: jobsData, isLoading, error } = useJobs({ limit: 20 });

  if (isLoading) return <div>Loading jobs...</div>;
  if (error) return <div>Error loading jobs: {error.message}</div>;

  const jobs = jobsData?.data || [];

  return (
    <div className="job-list">
      <h2>Available Jobs</h2>
      {jobs.map((job: any) => (
        <div key={job.id} className="job-card">
          <h3>{job.title}</h3>
          <p>{job.organization?.name}</p>
          <p>{job.placement} • {job.employmentType}</p>
          {job.salaryMin && (
            <p>${job.salaryMin.toLocaleString()} - ${job.salaryMax?.toLocaleString()}</p>
          )}
          <div dangerouslySetInnerHTML={{ __html: job.description }} />
          
          {user?.role === 'APPLICANT' && (
            <button onClick={() => applyToJob(job.id)}>
              Apply Now
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
```

## 🔄 Real-time Features (WebSocket)

### 1. Chat Integration

```typescript
// services/chat.service.ts
import { io, Socket } from 'socket.io-client';

class ChatService {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(token: string) {
    this.token = token;
    this.socket = io(API_BASE_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinConversation(conversationId: string) {
    if (this.socket) {
      this.socket.emit('join_conversation', { conversationId });
    }
  }

  sendMessage(conversationId: string, message: string) {
    if (this.socket) {
      this.socket.emit('send_message', {
        conversationId,
        message,
      });
    }
  }

  onMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }
}

export const chatService = new ChatService();
```

### 2. Chat Hook

```typescript
// hooks/useChat.ts
import { useEffect, useState } from 'react';
import { chatService } from '../services/chat.service';
import { useAuth } from './useAuth';

export const useChat = (conversationId?: string) => {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('access_token');
      if (token) {
        const socket = chatService.connect(token);
        
        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));
        
        chatService.onMessage((message) => {
          setMessages(prev => [...prev, message]);
        });

        if (conversationId) {
          chatService.joinConversation(conversationId);
        }
      }
    }

    return () => {
      chatService.disconnect();
    };
  }, [isAuthenticated, user, conversationId]);

  const sendMessage = (message: string) => {
    if (conversationId) {
      chatService.sendMessage(conversationId, message);
    }
  };

  return {
    messages,
    sendMessage,
    isConnected,
  };
};
```

## 📁 File Upload Integration

### 1. File Upload Component

```typescript
// components/FileUpload.tsx
import React, { useState } from 'react';
import { apiService } from '../services/api.service';

interface FileUploadProps {
  type: 'resume' | 'document' | 'image';
  onUploadSuccess: (url: string) => void;
  onUploadError: (error: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  type,
  onUploadSuccess,
  onUploadError,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const maxSizes = {
      resume: 5 * 1024 * 1024, // 5MB
      document: 10 * 1024 * 1024, // 10MB
      image: 5 * 1024 * 1024, // 5MB
    };

    if (file.size > maxSizes[type]) {
      onUploadError(`File size must be less than ${maxSizes[type] / 1024 / 1024}MB`);
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const result = await apiService.uploadFile(file, type);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      onUploadSuccess(result.data.url);
    } catch (error) {
      onUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        accept={type === 'image' ? 'image/*' : '.pdf,.doc,.docx'}
        onChange={handleFileChange}
        disabled={isUploading}
      />
      {isUploading && (
        <div className="upload-progress">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
          <span>{progress}%</span>
        </div>
      )}
    </div>
  );
};
```

## 🛡️ Error Handling & Validation

### 1. Error Boundary

```typescript
// components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 2. Form Validation

```typescript
// utils/validation.ts
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return errors;
};
```

## 🎨 UI/UX Best Practices

### 1. Loading States

```typescript
// components/LoadingSpinner.tsx
export const LoadingSpinner: React.FC<{ size?: 'small' | 'medium' | 'large' }> = ({ 
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`} />
  );
};
```

### 2. Toast Notifications

```typescript
// hooks/useToast.ts
import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};
```

## 📊 Performance Optimization

### 1. API Caching

```typescript
// services/cache.service.ts
class CacheService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }
}

export const cacheService = new CacheService();
```

### 2. Debounced Search

```typescript
// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

This comprehensive guide provides everything a frontend developer needs to integrate with your Pairova API effectively! 🚀
