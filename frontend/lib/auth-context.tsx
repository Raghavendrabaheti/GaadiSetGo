'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api, TokenManager } from '@/lib/api';

// Types
interface User {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    role?: string;
    created_at?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (userData: { email: string; password: string; full_name: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user && TokenManager.isAuthenticated();

    const initializeAuth = useCallback(async () => {
        try {
            if (TokenManager.isAuthenticated()) {
                await refreshUser();
            }
        } catch (error) {
            console.error('Authentication initialization failed:', error);
            TokenManager.clearTokens();
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initialize authentication state
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    const refreshUser = async () => {
        try {
            console.log('Attempting to refresh user profile...'); // Debug log
            const response = await api.getProfile();
            console.log('Profile response:', response); // Debug log
            if (response.success && response.data) {
                // Transform the user data to match frontend interface
                const userData = response.data as any;
                const transformedUser: User = {
                    id: userData._id || userData.id,
                    email: userData.email,
                    full_name: userData.full_name,
                    phone: userData.phone,
                    role: userData.role,
                    created_at: userData.created_at,
                };
                setUser(transformedUser);
                console.log('User profile updated:', transformedUser); // Debug log
            } else {
                throw new Error('Failed to fetch user profile');
            }
        } catch (error) {
            console.error('Failed to refresh user:', error);
            TokenManager.clearTokens();
            setUser(null);
            throw error;
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);

            // Clear any existing tokens before login
            TokenManager.clearTokens();

            console.log('Attempting login for:', email); // Debug log

            const response = await api.login({ email, password });

            console.log('Login response:', response); // Debug log

            if (response.success && response.data) {
                const data = response.data as any;
                // Handle nested data structure from backend
                const tokenData = data.data || data;
                const access_token = tokenData.access_token;
                const refresh_token = tokenData.refresh_token;

                if (!access_token || !refresh_token) {
                    console.error('Missing tokens in response:', { data, tokenData });
                    return {
                        success: false,
                        error: 'Invalid response format: missing tokens'
                    };
                }

                console.log('Received tokens:', {
                    access_token: access_token.substring(0, 20) + '...',
                    refresh_token: refresh_token.substring(0, 20) + '...'
                }); // Debug log

                // Store tokens
                TokenManager.setTokens(access_token, refresh_token);

                // Add a small delay to ensure tokens are persisted before fetching profile
                await new Promise(resolve => setTimeout(resolve, 100));

                console.log('About to fetch user profile...'); // Debug log
                // Fetch user profile data
                await refreshUser();

                console.log('Login successful, user profile set'); // Debug log
                return { success: true };
            } else {
                return {
                    success: false,
                    error: response.error || 'Login failed. Please check your credentials.'
                };
            }
        } catch (error: unknown) {
            console.error('Login error:', error);
            return {
                success: false,
                error: (error as Error).message || 'Network error. Please check if the backend server is running.'
            };
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData: { email: string; password: string; full_name: string; phone?: string }) => {
        try {
            setIsLoading(true);

            // Clear any existing tokens before registration
            TokenManager.clearTokens();

            console.log('Attempting registration for:', userData.email); // Debug log

            const response = await api.register(userData);

            console.log('Registration response:', response); // Debug log

            if (response.success && response.data) {
                const data = response.data as any;
                // Handle nested data structure from backend
                const tokenData = data.data || data;
                const access_token = tokenData.access_token;
                const refresh_token = tokenData.refresh_token;

                if (!access_token || !refresh_token) {
                    console.error('Missing tokens in response:', { data, tokenData });
                    return {
                        success: false,
                        error: 'Invalid response format: missing tokens'
                    };
                }

                console.log('Received tokens:', {
                    access_token: access_token.substring(0, 20) + '...',
                    refresh_token: refresh_token.substring(0, 20) + '...'
                }); // Debug log

                TokenManager.setTokens(access_token, refresh_token);

                // Add a small delay to ensure tokens are persisted before fetching profile
                await new Promise(resolve => setTimeout(resolve, 100));

                console.log('About to fetch user profile after registration...'); // Debug log
                // Fetch user profile data
                await refreshUser();

                console.log('Registration successful, user profile set'); // Debug log
                return { success: true };
            } else {
                return {
                    success: false,
                    error: response.error || 'Registration failed. Please try again.'
                };
            }
        } catch (error: unknown) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: (error as Error).message || 'Network error. Please check if the backend server is running.'
            };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        try {
            // Call logout API (fire and forget)
            api.logout().catch(console.error);
        } catch (error) {
            console.error('Logout API call failed:', error);
        } finally {
            // Clear local state regardless of API call result
            TokenManager.clearTokens();
            setUser(null);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthProvider;
