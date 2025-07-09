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
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Left side - Login form */}
      <div className="flex-1 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 relative">
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-20 left-10 animate-bounce">
            <Coins className="h-8 w-8 text-yellow-400" />
          </div>
          <div className="absolute top-40 right-20 animate-pulse">
            <Calculator className="h-6 w-6 text-blue-400" />
          </div>
          <div className="absolute bottom-40 left-20 animate-bounce delay-300">
            <Wallet className="h-7 w-7 text-green-400" />
          </div>
          <div className="absolute bottom-20 right-10 animate-pulse delay-500">
            <CreditCard className="h-6 w-6 text-purple-400" />
          </div>
        </div>
        
        <div className="mx-auto w-full max-w-sm lg:w-96 relative z-10">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center mb-6 sm:mb-8 animate-fade-in">
              <div className="relative">
                <Landmark className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-400 mr-2 sm:mr-3 animate-pulse" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full animate-ping"></div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                FinanceFlow
              </h1>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white animate-slide-up">
              Bem-vindo ao
            </h2>
            <h2 className="text-2xl sm:text-3xl font-bold text-white animate-slide-up">
              FinanceFlow
            </h2>
            <p className="mt-2 text-sm text-gray-300 animate-slide-up delay-100">
              Acesse seu painel financeiro pessoal
            </p>
          </div>

          <Card className="backdrop-blur-sm bg-white/10 border border-white/20 shadow-2xl animate-slide-up delay-200">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-300">CPF</FormLabel>
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
                              className="text-lg py-3 pl-12 bg-white/10 border border-white/20 text-white placeholder-gray-400 transition-all duration-300 focus:shadow-lg focus:scale-105 focus:border-emerald-400 focus:bg-white/20"
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                              <Shield className="h-5 w-5 text-emerald-400" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-white border-0"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      <>
                        Entrar
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="text-center mt-6">
                <p className="text-xs text-gray-400">
                  Não tem uma conta? <span className="text-emerald-400 cursor-pointer hover:underline">Cadastre-se</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Right side - Financial Illustration */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 overflow-hidden">
          {/* Animated background circles */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/15 rounded-full animate-pulse delay-300"></div>
            <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white/10 rounded-full animate-pulse delay-500"></div>
            <div className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-emerald-400/10 rounded-full animate-pulse delay-700"></div>
          </div>
          
          {/* Financial cityscape */}
          <div className="absolute bottom-0 left-0 right-0 h-96">
            {/* Buildings */}
            <div className="absolute bottom-0 left-10 w-16 h-32 bg-gradient-to-t from-yellow-400 to-orange-400 rounded-t-lg animate-fade-in delay-300">
              <div className="absolute top-2 left-2 w-3 h-3 bg-white/80 rounded"></div>
              <div className="absolute top-2 right-2 w-3 h-3 bg-white/80 rounded"></div>
              <div className="absolute top-6 left-2 w-3 h-3 bg-white/80 rounded"></div>
              <div className="absolute top-6 right-2 w-3 h-3 bg-white/80 rounded"></div>
              <div className="absolute bottom-2 left-2 right-2 h-8 bg-white/20 rounded flex items-center justify-center">
                <Landmark className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <div className="absolute bottom-0 left-32 w-20 h-40 bg-gradient-to-t from-purple-400 to-pink-400 rounded-t-lg animate-fade-in delay-500">
              <div className="absolute top-3 left-3 w-2 h-2 bg-white/80 rounded"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-white/80 rounded"></div>
              <div className="absolute top-7 left-3 w-2 h-2 bg-white/80 rounded"></div>
              <div className="absolute top-7 right-3 w-2 h-2 bg-white/80 rounded"></div>
              <div className="absolute top-11 left-3 w-2 h-2 bg-white/80 rounded"></div>
              <div className="absolute top-11 right-3 w-2 h-2 bg-white/80 rounded"></div>
              <div className="absolute bottom-2 left-2 right-2 h-10 bg-white/20 rounded flex items-center justify-center">
                <Building className="h-5 w-5 text-white" />
              </div>
            </div>
            
            <div className="absolute bottom-0 right-20 w-24 h-48 bg-gradient-to-t from-blue-400 to-cyan-400 rounded-t-lg animate-fade-in delay-700">
              <div className="absolute top-2 left-2 w-3 h-3 bg-white/80 rounded"></div>
              <div className="absolute top-2 right-2 w-3 h-3 bg-white/80 rounded"></div>
              <div className="absolute top-6 left-2 w-3 h-3 bg-white/80 rounded"></div>
              <div className="absolute top-6 right-2 w-3 h-3 bg-white/80 rounded"></div>
              <div className="absolute top-10 left-2 w-3 h-3 bg-white/80 rounded"></div>
              <div className="absolute top-10 right-2 w-3 h-3 bg-white/80 rounded"></div>
              <div className="absolute bottom-2 left-2 right-2 h-12 bg-white/20 rounded flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <div className="absolute bottom-0 right-50 w-18 h-36 bg-gradient-to-t from-emerald-400 to-green-400 rounded-t-lg animate-fade-in delay-400">
              <div className="absolute top-2 left-2 w-2 h-2 bg-white/80 rounded"></div>
              <div className="absolute top-2 right-2 w-2 h-2 bg-white/80 rounded"></div>
              <div className="absolute top-6 left-2 w-2 h-2 bg-white/80 rounded"></div>
              <div className="absolute top-6 right-2 w-2 h-2 bg-white/80 rounded"></div>
              <div className="absolute bottom-2 left-2 right-2 h-8 bg-white/20 rounded flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          
          {/* Floating financial elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 animate-float">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <Coins className="h-6 w-6 text-yellow-300" />
              </div>
            </div>
            <div className="absolute top-32 right-32 animate-float delay-200">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <Calculator className="h-6 w-6 text-blue-300" />
              </div>
            </div>
            <div className="absolute top-48 left-40 animate-float delay-400">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <Wallet className="h-6 w-6 text-emerald-300" />
              </div>
            </div>
            <div className="absolute top-64 right-20 animate-float delay-600">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <Banknote className="h-6 w-6 text-green-300" />
              </div>
            </div>
            <div className="absolute top-40 left-60 animate-float delay-800">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <PieChart className="h-6 w-6 text-purple-300" />
              </div>
            </div>
          </div>
          
          {/* Animated chart */}
          <div className="absolute top-20 right-16 w-48 h-32 bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-fade-in delay-1000">
            <div className="flex items-end justify-between h-16 mb-2">
              <div className="bg-emerald-400 rounded-t animate-grow" style={{height: '70%', width: '15%'}}></div>
              <div className="bg-blue-400 rounded-t animate-grow delay-100" style={{height: '60%', width: '15%'}}></div>
              <div className="bg-purple-400 rounded-t animate-grow delay-200" style={{height: '85%', width: '15%'}}></div>
              <div className="bg-pink-400 rounded-t animate-grow delay-300" style={{height: '45%', width: '15%'}}></div>
              <div className="bg-yellow-400 rounded-t animate-grow delay-400" style={{height: '90%', width: '15%'}}></div>
            </div>
            <div className="text-white/70 text-xs text-center">
              Análise Mensal
            </div>
          </div>
        </div>
        
        {/* Central content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8 z-10 max-w-md">
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse">
                <Landmark className="h-12 w-12 text-emerald-400" />
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 bg-emerald-500 rounded-full animate-bounce flex items-center justify-center">
                <span className="text-xs font-bold text-white">✓</span>
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-6 animate-fade-in">
              Controle Total das Suas Finanças
            </h3>
            <p className="text-lg opacity-90 animate-fade-in delay-200 mb-8">
              Gerencie receitas, despesas e investimentos em uma plataforma segura e intuitiva.
            </p>
            <div className="grid grid-cols-3 gap-4 animate-fade-in delay-400">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-emerald-300">100%</div>
                <div className="text-sm opacity-80">Seguro</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-blue-300">24/7</div>
                <div className="text-sm opacity-80">Disponível</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-purple-300">∞</div>
                <div className="text-sm opacity-80">Possibilidades</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
