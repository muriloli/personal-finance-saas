import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChartLine, Loader2, TrendingUp, DollarSign, PieChart, BarChart3, Shield, Target } from "lucide-react";
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
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Left side - Login form */}
      <div className="flex-1 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-20 left-10 animate-bounce">
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
          <div className="absolute top-40 right-20 animate-pulse">
            <TrendingUp className="h-6 w-6 text-blue-500" />
          </div>
          <div className="absolute bottom-40 left-20 animate-bounce delay-300">
            <PieChart className="h-7 w-7 text-purple-500" />
          </div>
          <div className="absolute bottom-20 right-10 animate-pulse delay-500">
            <BarChart3 className="h-6 w-6 text-orange-500" />
          </div>
        </div>
        
        <div className="mx-auto w-full max-w-sm lg:w-96 relative z-10">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center mb-6 sm:mb-8 animate-fade-in">
              <div className="relative">
                <ChartLine className="h-6 w-6 sm:h-8 sm:w-8 text-primary mr-2 sm:mr-3 animate-pulse" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FinanceFlow
              </h1>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground animate-slide-up">
              Entre em sua conta
            </h2>
            <p className="mt-2 text-sm text-muted-foreground animate-slide-up delay-100">
              Insira seu CPF para acessar seu painel financeiro
            </p>
          </div>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-2xl animate-slide-up delay-200">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">CPF</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="000.000.000-00"
                              maxLength={14}
                              value={formatCPF(field.value || "")}
                              onChange={(e) => {
                                const value = e.target.value;
                                const digitsOnly = value.replace(/\D/g, "");
                                
                                // Limit to 11 digits
                                if (digitsOnly.length <= 11) {
                                  field.onChange(digitsOnly);
                                }
                              }}
                              className="text-lg py-3 pl-12 transition-all duration-300 focus:shadow-lg focus:scale-105 border-2 focus:border-blue-500"
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                              <Shield className="h-5 w-5 text-blue-500" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      <>
                        <Target className="mr-2 h-4 w-4" />
                        Entrar
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="text-center mt-6">
                <p className="text-xs text-muted-foreground">
                  Ao fazer login, você concorda com nossos Termos de Serviço e Política de Privacidade
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Right side - Financial Graphics */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/15 rounded-full animate-pulse delay-300"></div>
            <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white/10 rounded-full animate-pulse delay-500"></div>
          </div>
          
          {/* Financial icons floating animation */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 animate-float">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="absolute top-40 right-32 animate-float delay-200">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <PieChart className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="absolute bottom-40 left-32 animate-float delay-400">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="absolute bottom-20 right-20 animate-float delay-600">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          
          {/* Animated chart simulation */}
          <div className="absolute bottom-16 left-16 right-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-end justify-between h-24 mb-4">
                <div className="bg-green-400 rounded-t animate-grow" style={{height: '60%', width: '12%'}}></div>
                <div className="bg-blue-400 rounded-t animate-grow delay-100" style={{height: '80%', width: '12%'}}></div>
                <div className="bg-purple-400 rounded-t animate-grow delay-200" style={{height: '45%', width: '12%'}}></div>
                <div className="bg-pink-400 rounded-t animate-grow delay-300" style={{height: '90%', width: '12%'}}></div>
                <div className="bg-indigo-400 rounded-t animate-grow delay-400" style={{height: '70%', width: '12%'}}></div>
                <div className="bg-cyan-400 rounded-t animate-grow delay-500" style={{height: '55%', width: '12%'}}></div>
              </div>
              <div className="text-white/80 text-sm text-center">
                Análise Financeira em Tempo Real
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8 z-10">
            <div className="relative mb-6">
              <ChartLine className="h-16 w-16 mx-auto opacity-90 animate-pulse" />
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-green-500 rounded-full animate-bounce flex items-center justify-center">
                <span className="text-xs font-bold text-white">✓</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-4 animate-fade-in">
              Assuma o controle de suas finanças
            </h3>
            <p className="text-lg opacity-90 animate-fade-in delay-200 max-w-md mx-auto">
              Monitore gastos, controle receitas e alcance seus objetivos financeiros com nossa plataforma intuitiva.
            </p>
            <div className="mt-6 flex justify-center space-x-6 animate-fade-in delay-400">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-300">100%</div>
                <div className="text-sm opacity-80">Seguro</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-300">24/7</div>
                <div className="text-sm opacity-80">Acesso</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-300">∞</div>
                <div className="text-sm opacity-80">Controle</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
