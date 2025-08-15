/**
 * API utility functions for connecting to the FastAPI backend
 */

// Base API URL - should match your backend server
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// API endpoints
export const API_ENDPOINTS = {
    // Health & Info
    HEALTH: '/health',
    ROOT: '/',

    // Authentication
    AUTH: {
        LOGIN: '/api/v1/auth/login',
        REGISTER: '/api/v1/auth/register',
        REFRESH: '/api/v1/auth/refresh',
        LOGOUT: '/api/v1/auth/logout',
        PROFILE: '/api/v1/auth/profile',
    },

    // Users
    USERS: {
        BASE: '/api/v1/users',
        PROFILE: '/api/v1/users/profile',
        UPDATE: '/api/v1/users/update',
    },

    // Parking
    PARKING: {
        BASE: '/api/v1/parking',
        BOOK: '/api/v1/parking/book',
        SLOTS: '/api/v1/parking/slots',
        HISTORY: '/api/v1/parking/history',
    },

    // Vehicles
    VEHICLES: {
        BASE: '/api/v1/vehicles',
        ADD: '/api/v1/vehicles/add',
        LIST: '/api/v1/vehicles',
        DELETE: '/api/v1/vehicles',
    },

    // Services
    SERVICES: {
        BASE: '/api/v1/services',
        BOOK: '/api/v1/services/book',
        HISTORY: '/api/v1/services/history',
    },

    // E-commerce
    ECOMMERCE: {
        BASE: '/api/v1/ecommerce',
        PRODUCTS: '/api/v1/ecommerce/products',
        CART: '/api/v1/ecommerce/cart',
        ORDERS: '/api/v1/ecommerce/orders',
    },

    // AI Assistant
    AI: {
        BASE: '/api/v1/ai',
        CHAT: '/api/v1/ai/chat',
        SUGGESTIONS: '/api/v1/ai/suggestions',
    },

    // FASTag
    FASTAG: {
        BASE: '/api/v1/fastag',
        BALANCE: '/api/v1/fastag/balance',
        RECHARGE: '/api/v1/fastag/recharge',
        TRANSACTIONS: '/api/v1/fastag/transactions',
    },

    // Challans
    CHALLANS: {
        BASE: '/api/v1/challans',
        CHECK: '/api/v1/challans/check',
        PAY: '/api/v1/challans/pay',
        HISTORY: '/api/v1/challans/history',
    },

    // Notifications
    NOTIFICATIONS: {
        BASE: '/api/v1/notifications',
        UNREAD: '/api/v1/notifications/unread',
        MARK_READ: '/api/v1/notifications/mark-read',
    },
};

// Types for API responses
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    timestamp?: string;
}

export interface ApiError {
    error: string;
    message: string;
    timestamp: string;
    status?: number;
    details?: unknown;
}

// Token management
class TokenManager {
    private static ACCESS_TOKEN_KEY = 'gaadisetgo_access_token';
    private static REFRESH_TOKEN_KEY = 'gaadisetgo_refresh_token';

    static getAccessToken(): string | null {
        if (typeof window === 'undefined') return null;
        const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
        console.log('Getting access token:', token ? token.substring(0, 20) + '...' : 'none');
        return token;
    }

    static setAccessToken(token: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    }

    static getRefreshToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    static setRefreshToken(token: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }

    static setTokens(accessToken: string, refreshToken: string): void {
        console.log('Setting tokens:', {
            access: accessToken.substring(0, 20) + '...',
            refresh: refreshToken.substring(0, 20) + '...'
        }); // Debug log
        this.setAccessToken(accessToken);
        this.setRefreshToken(refreshToken);
        console.log('Tokens set successfully'); // Debug log

        // Verify tokens were stored
        const storedAccess = this.getAccessToken();
        const storedRefresh = this.getRefreshToken();
        console.log('Verification - Stored access token:', storedAccess ? storedAccess.substring(0, 20) + '...' : 'none');
        console.log('Verification - Stored refresh token:', storedRefresh ? storedRefresh.substring(0, 20) + '...' : 'none');
    }

    static clearTokens(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }

    static isAuthenticated(): boolean {
        return !!this.getAccessToken();
    }
}

// API Client class
class ApiClient {
    private baseURL: string;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;

        // Check if this is an auth endpoint that shouldn't have tokens
        const authEndpoints = ['/auth/register', '/auth/login', '/auth/refresh'];
        const isAuthEndpoint = authEndpoints.some(authEndpoint => endpoint.includes(authEndpoint));

        // Default headers
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        // Add authentication header if token exists and it's not an auth endpoint
        const token = TokenManager.getAccessToken();
        console.log('Making request to:', endpoint, 'with token:', token ? token.substring(0, 20) + '...' : 'none'); // Debug log
        if (token && !isAuthEndpoint) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            ...options,
            headers,
        };

        // Log the request for debugging
        console.log('API Request:', {
            url,
            method: config.method || 'GET',
            headers,
            body: config.body
        });

        try {
            const response = await fetch(url, config);

            // Handle different response types
            const contentType = response.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                // Handle token expiration - but not for auth endpoints
                if (response.status === 401 && token && !isAuthEndpoint) {
                    console.log('Got 401, attempting token refresh...'); // Debug log
                    try {
                        await this.refreshToken();
                        // Retry the request with new token
                        const newToken = TokenManager.getAccessToken();
                        console.log('Got new token after refresh:', newToken ? newToken.substring(0, 20) + '...' : 'none'); // Debug log
                        if (newToken) {
                            const retryHeaders = { ...headers, 'Authorization': `Bearer ${newToken}` };
                            const retryResponse = await fetch(url, { ...config, headers: retryHeaders });

                            if (retryResponse.ok) {
                                const retryData = await retryResponse.json();
                                return { success: true, data: retryData };
                            }
                        }
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError); // Debug log
                    }

                    // If refresh failed, clear tokens and redirect to login
                    TokenManager.clearTokens();
                    window.location.href = '/auth';
                }

                // Log detailed error information for debugging
                console.error('API Request failed:', {
                    url,
                    method: config.method || 'GET',
                    status: response.status,
                    statusText: response.statusText,
                    data,
                    requestBody: config.body,
                    headers: config.headers
                });

                throw {
                    error: data.error || 'Request failed',
                    message: data.message || data.detail || `HTTP ${response.status}`,
                    status: response.status,
                    timestamp: new Date().toISOString(),
                    details: data
                } as ApiError;
            }

            return {
                success: true,
                data,
                message: data.message,
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw {
                    error: 'Network Error',
                    message: 'Unable to connect to the server. Please check if the backend is running.',
                    timestamp: new Date().toISOString(),
                } as ApiError;
            }
            throw error;
        }
    }

    private async refreshToken(): Promise<void> {
        const refreshToken = TokenManager.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            const response = await fetch(`${this.baseURL}${API_ENDPOINTS.AUTH.REFRESH}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${refreshToken}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Refresh token response:', data); // Debug log
                if (data.success && data.data) {
                    // Handle nested data structure from backend
                    const tokenData = data.data.data || data.data;
                    const access_token = tokenData.access_token;
                    const refresh_token = tokenData.refresh_token;

                    if (access_token) {
                        TokenManager.setTokens(access_token, refresh_token || refreshToken);
                    } else {
                        console.error('No access token in refresh response:', tokenData);
                        throw new Error('Token refresh failed - no access token');
                    }
                } else {
                    console.error('Invalid refresh response format:', data);
                    throw new Error('Token refresh failed - invalid response format');
                }
            } else {
                const errorData = await response.json();
                console.error('Refresh token failed:', {
                    status: response.status,
                    error: errorData
                });
                throw new Error(errorData.detail || errorData.message || 'Token refresh failed');
            }
        } catch (error) {
            console.error('Refresh token error:', error);
            TokenManager.clearTokens();
            throw error;
        }
    }

    // HTTP Methods
    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

// Create and export API client instance
export const apiClient = new ApiClient();

// Export token manager for external use
export { TokenManager };

// Utility functions for common API operations
export const api = {
    // Health check
    healthCheck: () => apiClient.get(API_ENDPOINTS.HEALTH),

    // Authentication
    login: (credentials: { email: string; password: string }) =>
        apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials),

    register: (userData: {
        email: string;
        password: string;
        full_name: string;
        phone?: string
    }) => apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData),

    logout: () => apiClient.post(API_ENDPOINTS.AUTH.LOGOUT),

    getProfile: () => apiClient.get(API_ENDPOINTS.USERS.PROFILE),

    // Parking
    getParkingSlots: () => apiClient.get(API_ENDPOINTS.PARKING.SLOTS),

    bookParkingSlot: (bookingData: {
        slot_id: string;
        vehicle_id: string;
        duration: number;
    }) => apiClient.post(API_ENDPOINTS.PARKING.BOOK, bookingData),

    getParkingHistory: () => apiClient.get(API_ENDPOINTS.PARKING.HISTORY),

    // Vehicles
    getVehicles: () => apiClient.get(API_ENDPOINTS.VEHICLES.LIST),

    addVehicle: (vehicleData: {
        make: string;
        model: string;
        year: number;
        license_plate: string;
        color: string;
    }) => apiClient.post(API_ENDPOINTS.VEHICLES.ADD, vehicleData),

    deleteVehicle: (vehicleId: string) =>
        apiClient.delete(`${API_ENDPOINTS.VEHICLES.DELETE}/${vehicleId}`),

    // Services
    getServices: () => apiClient.get(API_ENDPOINTS.SERVICES.BASE),

    bookService: (serviceData: {
        service_type: string;
        vehicle_id: string;
        scheduled_date: string;
        notes?: string;
    }) => apiClient.post(API_ENDPOINTS.SERVICES.BOOK, serviceData),

    getServiceHistory: () => apiClient.get(API_ENDPOINTS.SERVICES.HISTORY),

    // E-commerce
    getProducts: () => apiClient.get(API_ENDPOINTS.ECOMMERCE.PRODUCTS),

    getCart: () => apiClient.get(API_ENDPOINTS.ECOMMERCE.CART),

    addToCart: (productData: { product_id: string; quantity: number }) =>
        apiClient.post(API_ENDPOINTS.ECOMMERCE.CART, productData),

    // AI Assistant
    sendChatMessage: (message: { message: string; context?: string }) =>
        apiClient.post(API_ENDPOINTS.AI.CHAT, message),

    getSuggestions: () => apiClient.get(API_ENDPOINTS.AI.SUGGESTIONS),

    // FASTag
    getFastagBalance: () => apiClient.get(API_ENDPOINTS.FASTAG.BALANCE),

    rechargeFastag: (rechargeData: { amount: number; payment_method: string }) =>
        apiClient.post(API_ENDPOINTS.FASTAG.RECHARGE, rechargeData),

    getFastagTransactions: () => apiClient.get(API_ENDPOINTS.FASTAG.TRANSACTIONS),

    // Challans
    checkChallans: (vehicleNumber: string) =>
        apiClient.get(`${API_ENDPOINTS.CHALLANS.CHECK}?vehicle_number=${vehicleNumber}`),

    payChallans: (challanData: { challan_id: string; payment_method: string }) =>
        apiClient.post(API_ENDPOINTS.CHALLANS.PAY, challanData),

    getChallanHistory: () => apiClient.get(API_ENDPOINTS.CHALLANS.HISTORY),

    // Notifications
    getNotifications: () => apiClient.get(API_ENDPOINTS.NOTIFICATIONS.BASE),

    getUnreadNotifications: () => apiClient.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD),

    markNotificationAsRead: (notificationId: string) =>
        apiClient.patch(`${API_ENDPOINTS.NOTIFICATIONS.MARK_READ}/${notificationId}`),
};

export default api;
