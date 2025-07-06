import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChartLine, Loader2, UserPlus, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useI18n } from "@/lib/i18n";

const userRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  cpf: z.string().regex(/^\d{11}$/, "CPF must be 11 digits"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
});

type UserRegistrationForm = z.infer<typeof userRegistrationSchema>;

export default function UserRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useI18n();

  const form = useForm<UserRegistrationForm>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      name: "",
      cpf: "",
      phone: "",
    },
  });

  const onSubmit = async (data: UserRegistrationForm) => {
    try {
      setIsLoading(true);
      
      await apiRequest("/api/users/register", {
        method: "POST",
        body: data,
      });

      toast({
        title: "Success",
        description: "User registered successfully",
      });

      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to register user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ChartLine className="h-8 w-8 text-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">FinanceFlow</h1>
                <p className="text-sm text-muted-foreground">Admin Panel</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">{t("userRegistration")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                {t("registerNewUser")}
              </CardTitle>
              <CardDescription>
                {t("registerUserDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fullName")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("enterFullName")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("cpf")}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="00000000000" 
                            maxLength={11}
                            {...field}
                            onChange={(e) => {
                              // Only allow numbers
                              const value = e.target.value.replace(/\D/g, '');
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("phone")}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+5511999999999" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("registering")}...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        {t("registerUser")}
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}