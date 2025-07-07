import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChartLine, Loader2 } from "lucide-react";
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
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);
    if (match) {
      return [match[1], match[2], match[3], match[4]]
        .filter(Boolean)
        .join(".")
        .replace(/\.(\d{2})$/, "-$1");
    }
    return cleaned;
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login form */}
      <div className="flex-1 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center mb-6 sm:mb-8">
              <ChartLine className="h-6 w-6 sm:h-8 sm:w-8 text-primary mr-2 sm:mr-3" />
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">FinanceFlow</h1>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Entre em sua conta</h2>
            <p className="mt-2 text-sm text-muted-foreground">Insira seu CPF para acessar seu painel financeiro</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="000.000.000-00"
                            maxLength={14}
                            onChange={(e) => {
                              const formatted = formatCPF(e.target.value);
                              field.onChange(formatted.replace(/\D/g, ""));
                              e.target.value = formatted;
                            }}
                            className="text-lg py-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full py-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
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
      {/* Right side - Background */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-primary to-success">
          <div className="absolute inset-0 bg-black/20"></div>
          {/* Abstract geometric shapes */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-white/20 transform rotate-45"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/15 rounded-lg"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <ChartLine className="h-16 w-16 mx-auto mb-6 opacity-80" />
            <h3 className="text-2xl font-bold mb-4">Take Control of Your Finances</h3>
            <p className="text-lg opacity-90">
              Track expenses, monitor income, and achieve your financial goals with our intuitive platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
