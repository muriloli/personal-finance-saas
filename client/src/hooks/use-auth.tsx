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
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 🔧 CORREÇÃO PRINCIPAL: Fazer hasToken reativo
  const [hasToken, setHasToken] = useState(false);

  // Query to fetch current user
  const {
    data: currentUser,
    isLoading,
    refetch: refetchUser,
    error,
  } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: AuthService.getCurrentUser,
    enabled: hasToken && isInitialized, // ✅ Só executa se tem token E está inicializado
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // 🔧 CORREÇÃO: Inicializar estado uma única vez
  useEffect(() => {
    const token = AuthService.getSessionToken();
    const storedUser = AuthService.getStoredUser();
    
    console.log("Inicializando AuthProvider:");
    console.log("Token encontrado:", !!token);
    console.log("User encontrado:", !!storedUser);
    
    if (token && storedUser) {
      setUser(storedUser);
      setHasToken(true);
    } else {
      setUser(null);
      setHasToken(false);
    }
    
    setIsInitialized(true);
  }, []);

  // 🔧 CORREÇÃO: Atualizar user quando query retorna dados
  useEffect(() => {
    if (currentUser) {
      console.log("Query retornou user:", currentUser);
      setUser(currentUser);
      AuthService.setStoredUser(currentUser);
    }
  }, [currentUser]);

  // 🔧 CORREÇÃO: Lidar com erros de autenticação
  useEffect(() => {
    if (error && !isLoading && hasToken) {
      console.error("Auth error:", error);
      
      // Só limpar em caso de erro 401, 404 ou token inválido
      if (error.message?.includes('401') || 
          error.message?.includes('404') ||
          error.message?.includes('Unauthorized') ||
          error.message?.includes('No session token') ||
          error.message?.includes('Failed to fetch')) {
        console.log("Erro de autenticação, mas mantendo usuário logado localmente");
        // NÃO fazer logout automático - manter dados locais
        // AuthService.clearSession();
        // setUser(null);
        // setHasToken(false);
        // setLocation("/login");
      }
    }
  }, [error, isLoading, hasToken, setLocation]);

  const login = async (cpf: string): Promise<void> => {
    try {
      console.log("Iniciando login para CPF:", cpf);
      
      const { user: loggedInUser, sessionToken } = await AuthService.login(cpf);
      
      console.log("Login bem-sucedido:", loggedInUser);
      console.log("Token salvo:", !!sessionToken);
      
      // Atualizar estados
      setUser(loggedInUser);
      setHasToken(true);
      
      // Invalidar queries para forçar refetch
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      
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
      console.log("Fazendo logout");
      
      // Limpar cache primeiro
      queryClient.clear();
      
      // Limpar sessão
      AuthService.logout();
      
      // Atualizar estados
      setUser(null);
      setHasToken(false);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      
      setLocation("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout mesmo se der erro
      queryClient.clear();
      AuthService.clearSession();
      setUser(null);
      setHasToken(false);
      setLocation("/login");
    }
  };

  const value: AuthContextType = {
    user,
    isLoading: isLoading || !isInitialized,
    isAuthenticated: !!user && !!AuthService.getSessionToken(),
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

// Hook for protecting routes
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
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