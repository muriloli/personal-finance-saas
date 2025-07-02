import { apiRequest } from "./queryClient";

export interface User {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  isActive: boolean;
}

export interface LoginResponse {
  user: User;
  sessionToken: string;
}

export class AuthService {
  private static readonly SESSION_TOKEN_KEY = "sessionToken";
  private static readonly USER_KEY = "user";

  static async login(cpf: string): Promise<LoginResponse> {
    const response = await apiRequest("POST", "/api/auth/login", { cpf });
    const data = await response.json();
    
    // Store session token and user data
    localStorage.setItem(this.SESSION_TOKEN_KEY, data.sessionToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
    
    return data;
  }

  static async logout(): Promise<void> {
    try {
      const token = this.getSessionToken();
      if (token) {
        await apiRequest("POST", "/api/auth/logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage
      localStorage.removeItem(this.SESSION_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    const token = this.getSessionToken();
    if (!token) {
      return null;
    }

    try {
      const response = await apiRequest("GET", "/api/auth/me");
      const user = await response.json();
      
      // Update stored user data
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error("Get current user error:", error);
      // Clear invalid session
      this.clearSession();
      return null;
    }
  }

  static getSessionToken(): string | null {
    return localStorage.getItem(this.SESSION_TOKEN_KEY);
  }

  static getStoredUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    if (!userData) {
      return null;
    }

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  static isAuthenticated(): boolean {
    return !!this.getSessionToken();
  }

  static clearSession(): void {
    localStorage.removeItem(this.SESSION_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static setupAxiosInterceptor() {
    // Add authentication header to all requests
    const originalFetch = window.fetch;
    window.fetch = async (url, config = {}) => {
      const token = this.getSessionToken();
      
      if (token && typeof url === "string" && url.startsWith("/api")) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      const response = await originalFetch(url, config);

      // Handle 401 responses by clearing session
      if (response.status === 401) {
        this.clearSession();
        // Redirect to login if not already on login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }

      return response;
    };
  }

  static formatCPF(cpf: string): string {
    const cleaned = cpf.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return cpf;
  }

  static validateCPF(cpf: string): boolean {
    const cleaned = cpf.replace(/\D/g, "");
    
    if (cleaned.length !== 11) {
      return false;
    }

    // Check for repeated digits
    if (/^(\d)\1{10}$/.test(cleaned)) {
      return false;
    }

    // Validate CPF algorithm
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned.charAt(i)) * (10 - i);
    }
    let firstDigit = 11 - (sum % 11);
    if (firstDigit >= 10) firstDigit = 0;

    if (parseInt(cleaned.charAt(9)) !== firstDigit) {
      return false;
    }

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned.charAt(i)) * (11 - i);
    }
    let secondDigit = 11 - (sum % 11);
    if (secondDigit >= 10) secondDigit = 0;

    return parseInt(cleaned.charAt(10)) === secondDigit;
  }
}

// Initialize auth service
AuthService.setupAxiosInterceptor();
