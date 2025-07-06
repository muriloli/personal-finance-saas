// src/lib/auth.ts

export interface User {
  id: string;
  name: string;
  cpf: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  admin?: boolean;
}

export interface LoginResponse {
  user: User;
  sessionToken: string;
}

export const AuthService = {
  // Token management
  getSessionToken: (): string | null => {
    try {
      return localStorage.getItem('sessionToken');
    } catch (error) {
      console.error('Error getting session token:', error);
      return null;
    }
  },
  
  setSessionToken: (token: string): void => {
    try {
      localStorage.setItem('sessionToken', token);
    } catch (error) {
      console.error('Error setting session token:', error);
    }
  },
  
  // User management
  getStoredUser: (): User | null => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  },
  
  setStoredUser: (user: User): void => {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error setting stored user:', error);
    }
  },
  
  // Session management
  clearSession: (): void => {
    try {
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  },
  
  isAuthenticated: (): boolean => {
    const token = AuthService.getSessionToken();
    const user = AuthService.getStoredUser();
    return !!(token && user);
  },
  
  // API calls
  login: async (cpf: string): Promise<LoginResponse> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      // Store token and user data
      AuthService.setSessionToken(data.sessionToken);
      AuthService.setStoredUser(data.user);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: async (): Promise<void> => {
    try {
      const token = AuthService.getSessionToken();
      
      if (token) {
        // Optional: call logout endpoint
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Always clear local session
      AuthService.clearSession();
    }
  },
  
  getCurrentUser: async (): Promise<User> => {
    try {
      const token = AuthService.getSessionToken();
      
      if (!token) {
        throw new Error('No session token found');
      }
      
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Se não conseguir conectar com a API, retornar dados locais
      if (!response.ok) {
        console.warn(`API call failed with status ${response.status}, using stored user data`);
        const storedUser = AuthService.getStoredUser();
        if (storedUser) {
          return storedUser;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Verificar se retornou dados válidos
      if (!data || !data.user) {
        console.warn('API returned invalid data, using stored user data');
        const storedUser = AuthService.getStoredUser();
        if (storedUser) {
          return storedUser;
        }
        throw new Error('No valid user data received from API');
      }
      
      // Update stored user data
      AuthService.setStoredUser(data.user);
      
      return data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      
      // Fallback: tentar retornar dados armazenados localmente
      const storedUser = AuthService.getStoredUser();
      if (storedUser) {
        console.log('Using stored user data as fallback');
        return storedUser;
      }
      
      throw error;
    }
  },
  
  // Utility function to get authorization header
  getAuthHeader: (): Record<string, string> => {
    const token = AuthService.getSessionToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};