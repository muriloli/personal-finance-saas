import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChartLine, Loader2, TrendingUp, DollarSign, PieChart, BarChart3, Shield, Target, Building, Wallet, CreditCard, TrendingDown, Calculator, Coins, Banknote, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema } from "@shared/schema";
import { z } from "zod";

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect is now handled in the auth hook based on admin status

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      cpf: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await login(data.cpf);
      // Redirect is now handled in the login function based on admin status
    } catch (error) {
      form.setError("cpf", {
        type: "manual",
        message: "Invalid CPF or user not found",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCPF = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, "");
    
    // Apply CPF formatting: xxx.xxx.xxx-xx
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return cleaned.replace(/(\d{3})(\d+)/, "$1.$2");
    } else if (cleaned.length <= 9) {
      return cleaned.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
    } else {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, "$1.$2.$3-$4");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle geometric patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 dark:opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-success/20 rounded-full blur-3xl animate-pulse delay-300"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-muted/30 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
      </div>

      {/* Left side - Login form */}
      <div className="flex-1 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 relative z-10">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center mb-8 sm:mb-10 animate-fade-in">
              <div className="relative mr-3">
                <Landmark className="h-8 w-8 text-primary animate-pulse" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-success rounded-full animate-ping"></div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                FinanceFlow
              </h1>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground animate-slide-up">
              Bem-vindo de volta
            </h2>
            <p className="mt-3 text-base text-muted-foreground animate-slide-up delay-100">
              Faça login para acessar seu painel financeiro
            </p>
          </div>

          {/* Glassmorphism login card */}
          <div className="backdrop-blur-2xl bg-white/20 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-2xl shadow-black/10 dark:shadow-black/50 animate-slide-up delay-200 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent"></div>
            <div className="relative z-10 pt-8 pb-6 px-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-white/90">CPF</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="000.000.000-00"
                              maxLength={14}
                              value={formatCPF(field.value || "")}
                              onChange={(e) => {
                                const value = e.target.value;
                                const digitsOnly = value.replace(/\D/g, "");
                                
                                if (digitsOnly.length <= 11) {
                                  field.onChange(digitsOnly);
                                }
                              }}
                              className="text-lg py-4 pl-12 pr-4 bg-white/30 dark:bg-white/10 backdrop-blur-md border border-gray-300/60 dark:border-white/20 text-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-white/60 rounded-lg transition-all duration-300 focus:shadow-lg focus:scale-[1.02] focus:border-primary focus:bg-white/40 dark:focus:bg-white/20 focus:backdrop-blur-xl shadow-sm"
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <Shield className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 backdrop-blur-sm text-white transform transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl rounded-lg border border-white/30 dark:border-white/20"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </form>
              </Form>

              <div className="text-center mt-8">
                <p className="text-sm text-gray-600 dark:text-white/70">
                  Ao fazer login, você concorda com nossos{" "}
                  <span className="text-primary hover:underline cursor-pointer">
                    Termos de Serviço
                  </span>{" "}
                  e{" "}
                  <span className="text-primary hover:underline cursor-pointer">
                    Política de Privacidade
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Clean background with content */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-muted/30 via-background to-muted/40 dark:from-gray-800/50 dark:via-gray-900/70 dark:to-gray-800/30 backdrop-blur-sm">
          {/* Central content only */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8 z-10 max-w-lg">
              <div className="relative mb-8">
                <div className="w-28 h-28 mx-auto bg-white/20 dark:bg-gray-800/20 rounded-full flex items-center justify-center backdrop-blur-md animate-pulse border border-white/30 dark:border-gray-700/30">
                  <ChartLine className="h-14 w-14 text-primary" />
                </div>
              </div>
              <h3 className="text-4xl font-bold mb-6 text-foreground animate-fade-in">
                Controle Financeiro Inteligente
              </h3>
              <p className="text-lg text-muted-foreground animate-fade-in delay-200 mb-10">
                Gerencie suas finanças pessoais com tecnologia avançada e interface intuitiva
              </p>
              <div className="grid grid-cols-3 gap-6 animate-fade-in delay-400">
                <div className="bg-white/20 dark:bg-gray-800/20 p-6 rounded-xl backdrop-blur-md border border-white/30 dark:border-gray-700/30">
                  <div className="text-2xl font-bold text-primary mb-1">100%</div>
                  <div className="text-sm text-muted-foreground">Seguro</div>
                </div>
                <div className="bg-white/20 dark:bg-gray-800/20 p-6 rounded-xl backdrop-blur-md border border-white/30 dark:border-gray-700/30">
                  <div className="text-2xl font-bold text-success mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Disponível</div>
                </div>
                <div className="bg-white/20 dark:bg-gray-800/20 p-6 rounded-xl backdrop-blur-md border border-white/30 dark:border-gray-700/30">
                  <div className="text-2xl font-bold text-primary mb-1">∞</div>
                  <div className="text-sm text-muted-foreground">Controle</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
