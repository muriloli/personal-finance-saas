import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { AuthService, User } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (cpf: string) => Promise<void>;
  logout: () => void;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(AuthService.getStoredUser());
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to fetch current user - CORRIGIDO para não executar imediatamente
  const {
    data: currentUser,
    isLoading,
    refetch: refetchUser,
    error,
  } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: AuthService.getCurrentUser,
    enabled: false, // ← CORREÇÃO: Não executa automaticamente
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update user state when query data changes - CORRIGIDO
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    } else if (error && !isLoading) {
      // ✅ CORREÇÃO: Só limpar se realmente não há token
      const token = AuthService.getSessionToken();
      if (!token) {
        setUser(null);
        AuthService.clearSession();
      }
      // Se tem token, não limpar - pode ser erro temporário da API
    }
  }, [currentUser, error, isLoading]);

  // Check authentication status on mount - CORRIGIDO
  useEffect(() => {
    const token = AuthService.getSessionToken();
    const storedUser = AuthService.getStoredUser();
    
    if (token && storedUser) {
      // ✅ CORREÇÃO: Se tem token E user, definir como autenticado
      setUser(storedUser);
      // Opcionalmente, refetch user data
      refetchUser();
    } else {
      // Só limpar se realmente não tem nada
      setUser(null);
      AuthService.clearSession();
    }
  }, [refetchUser]);

  const login = async (cpf: string): Promise<void> => {
    try {
      const { user: loggedInUser, sessionToken } = await AuthService.login(cpf);
      setUser(loggedInUser);
      
      // Invalidate all queries and refetch user data
      queryClient.invalidateQueries();
      
      toast({
        title: "Welcome back!",
        description: `Hello, ${loggedInUser.name}!`,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Login failed");
    }
  };

  const logout = () => {
    try {
      AuthService.logout();
      setUser(null);
      
      // Clear all cached data
      queryClient.clear();
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      
      setLocation("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API call fails
      AuthService.clearSession();
      setUser(null);
      queryClient.clear();
      setLocation("/login");
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user && AuthService.isAuthenticated(),
    login,
    logout,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook for protecting routes - CORRIGIDO
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // ✅ CORREÇÃO: Só redirecionar se realmente não autenticado E não carregando
    if (!isLoading && !isAuthenticated) {
      const token = AuthService.getSessionToken();
      if (!token) {
        setLocation("/login");
      }
    }
  }, [isAuthenticated, isLoading, setLocation]);

  return { isAuthenticated, isLoading };
}

// Hook for redirecting authenticated users
export function useRedirectIfAuthenticated() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  return { isAuthenticated, isLoading };
}