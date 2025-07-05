import { useEffect } from "react";
import { useLocation } from "wouter";
import { Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Unauthorized() {
  const [, setLocation] = useLocation();

  // Redirecionar para login após 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
            <Lock className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Acesso Negado
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Você precisa estar logado para acessar esta página
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Você será redirecionado para a página de login em alguns segundos...
            </p>
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={() => setLocation("/login")}
                className="w-full"
              >
                Ir para Login
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}