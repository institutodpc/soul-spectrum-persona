
import React from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassmorphicCard from "@/components/ui-custom/GlassmorphicCard";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import GradientButton from "@/components/ui-custom/GradientButton";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  whatsapp: z.string().min(11, { message: "WhatsApp deve ter pelo menos 11 dígitos" }),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      whatsapp: "",
    },
  });
  
  // Check if user is already logged in
  React.useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        toast.info("Você já está logado. Redirecionando para o diagnóstico...");
        navigate("/diagnostic");
      }
    };
    
    checkAuthStatus();
  }, [navigate]);
  
  async function onSubmit(values: FormValues) {
    try {
      setIsLoading(true);
      setError(null);
      
      // Format WhatsApp number (remove non-digits)
      const cleanWhatsApp = values.whatsapp.replace(/\D/g, '');
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: cleanWhatsApp,
      });
      
      if (error) {
        console.error("Login error:", error);
        if (error.message.includes("Email not confirmed")) {
          setError("Email não confirmado. Por favor, verifique sua caixa de entrada.");
        } else {
          setError("Falha no login. Verifique seu email e WhatsApp.");
        }
        setIsLoading(false);
        return;
      }
      
      toast.success("Login realizado com sucesso!");
      navigate("/diagnostic");
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Ocorreu um erro durante o login");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-dpc-pink/10 via-dpc-coral/10 to-purple-500/10 animate-background-gradient"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-dpc-pink/20 blur-3xl animate-pulse-light"></div>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 rounded-full bg-dpc-coral/20 blur-3xl animate-float"></div>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="max-w-md w-full">
          <GlassmorphicCard className="p-6 md:p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 holographic-text">Login</h1>
              <p className="text-muted-foreground">
                Entre com seu email e WhatsApp para continuar
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <GradientButton 
                  type="submit" 
                  className="w-full py-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Processando..." : "Entrar"}
                </GradientButton>

                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Não tem uma conta?{" "}
                    <Link to="/register" className="text-dpc-pink hover:underline">
                      Cadastre-se
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </GlassmorphicCard>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Login;
