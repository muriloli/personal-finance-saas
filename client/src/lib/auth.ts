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
    console.log("🔥 AuthService.login chamado com CPF:", cpf);
    
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cpf }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("💾 Salvando token:", data.sessionToken);
    
    localStorage.setItem(this.SESSION_TOKEN_KEY, data.sessionToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
    
    console.log("✅ Token salvo:", localStorage.getItem(this.SESSION_TOKEN_KEY));
    return data;
  }

  static getSessionToken(): string | null {
    return localStorage.getItem(this.SESSION_TOKEN_KEY);
  }

  static getStoredUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getSessionToken();
  }

  static clearSession(): void {
    localStorage.removeItem(this.SESSION_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}