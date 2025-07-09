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
        
        {/* Floating financial icons */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <div className="absolute top-20 left-20 animate-float">
            <Coins className="h-8 w-8 text-success" />
          </div>
          <div className="absolute top-40 right-32 animate-float delay-200">
            <Calculator className="h-6 w-6 text-primary" />
          </div>
          <div className="absolute bottom-40 left-32 animate-float delay-400">
            <Wallet className="h-7 w-7 text-success" />
          </div>
          <div className="absolute bottom-20 right-20 animate-float delay-600">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
          <div className="absolute top-1/2 left-1/4 animate-float delay-800">
            <PieChart className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="absolute top-3/4 right-1/4 animate-float delay-1000">
            <BarChart3 className="h-7 w-7 text-primary" />
          </div>
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
          <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-gray-700/20 shadow-2xl shadow-black/10 dark:shadow-black/30 animate-slide-up delay-200">
            <CardContent className="pt-8 pb-6 px-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-foreground">CPF</FormLabel>
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
                              className="text-lg py-4 pl-12 pr-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 text-foreground placeholder-muted-foreground rounded-lg transition-all duration-300 focus:shadow-lg focus:scale-[1.02] focus:border-primary focus:bg-white/70 dark:focus:bg-gray-800/70"
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
                    className="w-full py-4 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transform transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl rounded-lg"
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
                <p className="text-sm text-muted-foreground">
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
            </CardContent>
          </Card>
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
                <div className="absolute -top-2 -right-2 h-8 w-8 bg-success rounded-full animate-bounce flex items-center justify-center">
                  <span className="text-xs font-bold text-white">✓</span>
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
