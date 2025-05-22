
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Form } from "@/components/ui/form";
import GradientButton from "@/components/ui-custom/GradientButton";
import { formSchema, FormValues } from "./register/schema";
import PersonalInfoFields from "./register/PersonalInfoFields";
import LocationFields from "./register/LocationFields";
import ContactFields from "./register/ContactFields";
import TermsField from "./register/TermsField";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [registrationError, setRegistrationError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [rateLimitTimer, setRateLimitTimer] = React.useState<number | null>(null);
  
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      sobrenome: "",
      cidade: "",
      congregacao: "",
      email: "",
      whatsapp: "",
      aceitoTermos: false,
    },
  });

  React.useEffect(() => {
    // Cleanup timer when component unmounts
    return () => {
      if (rateLimitTimer !== null) {
        clearInterval(rateLimitTimer);
      }
    };
  }, [rateLimitTimer]);

  // Check if user is already logged in and redirect if needed
  React.useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // User is already logged in, redirect to diagnostic page
        toast.info("Você já está logado. Redirecionando para o diagnóstico...");
        navigate("/diagnostic");
      }
    };
    
    checkAuthStatus();
  }, [navigate]);

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);
      setRegistrationError(null);
      
      // Validar e formatar o e-mail
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(values.email)) {
        setRegistrationError("Por favor, informe um e-mail válido.");
        setIsSubmitting(false);
        return;
      }
      
      // Formatar o número de WhatsApp para ser usado como senha (apenas dígitos)
      const cleanWhatsApp = values.whatsapp.replace(/\D/g, '');
      
      if (cleanWhatsApp.length < 11) {
        setRegistrationError("O número de WhatsApp deve ter pelo menos 11 dígitos, incluindo o DDD.");
        setIsSubmitting(false);
        return;
      }
      
      console.log("Form values:", values);
      
      // Registrar usuário no Supabase Auth diretamente sem verificação prévia
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: values.email,
          password: cleanWhatsApp, // Usando o WhatsApp como senha (simplificado)
          options: {
            data: {
              nome: values.nome,
              sobrenome: values.sobrenome,
              data_nascimento: values.dataNascimento ? values.dataNascimento.toISOString() : null,
              sexo: values.sexo,
              estado: values.estado,
              cidade: values.cidade,
              congregacao: values.congregacao,
              whatsapp: values.whatsapp
            },
          },
        });

        if (authError) {
          console.error("Erro de autenticação:", authError);
          
          // Handle rate limiting errors
          if (authError.message.includes("security purposes") && authError.message.includes("after")) {
            // Extract wait time from error message
            const waitTimeMatch = authError.message.match(/after (\d+) seconds/);
            
            if (waitTimeMatch && waitTimeMatch[1]) {
              const waitTime = parseInt(waitTimeMatch[1], 10);
              setRegistrationError(`Por motivos de segurança, você só pode solicitar isto após ${waitTime} segundos.`);
              
              // Start countdown timer
              let timeLeft = waitTime;
              const timerId = window.setInterval(() => {
                timeLeft--;
                setRegistrationError(`Por motivos de segurança, você só pode solicitar isto após ${timeLeft} segundos.`);
                
                if (timeLeft <= 0) {
                  clearInterval(timerId);
                  setRegistrationError(null);
                  setRateLimitTimer(null);
                }
              }, 1000);
              
              setRateLimitTimer(timerId);
            } else {
              setRegistrationError("Muitas tentativas em um curto período. Por favor, aguarde alguns minutos e tente novamente.");
            }
          } else if (authError.message.includes("User already registered")) {
            // If user already exists, try to sign in directly
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email: values.email,
              password: cleanWhatsApp,
            });
            
            if (signInError) {
              setRegistrationError("Este e-mail já está cadastrado. Verifique sua senha (WhatsApp) e tente novamente.");
            } else {
              toast.success("Login realizado com sucesso! Redirecionando para o diagnóstico...");
              setTimeout(() => {
                navigate("/diagnostic");
              }, 1000);
              return;
            }
          } else {
            setRegistrationError("Erro ao realizar cadastro: " + authError.message);
          }
          
          setIsSubmitting(false);
          return;
        }

        if (!authData.user) {
          throw new Error("Erro ao criar usuário. Nenhum usuário retornado pela API.");
        }

        toast.success("Cadastro realizado com sucesso! Redirecionando para o diagnóstico...");
        
        // Sign in the user automatically after successful registration
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: cleanWhatsApp,
        });
        
        if (signInError) {
          console.error("Erro ao fazer login automático:", signInError);
          toast.error("Cadastro realizado, mas não foi possível fazer login automático. Por favor, faça login manualmente.");
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        } else {
          // Redirect to diagnostic page after successful login
          setTimeout(() => {
            navigate("/diagnostic");
          }, 1000);
        }
      } catch (error: any) {
        console.error("Erro durante o processo de autenticação:", error);
        setRegistrationError("Erro durante o processo de autenticação. Por favor, tente novamente.");
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error("Erro ao realizar cadastro:", error);
      setRegistrationError(error.message || "Erro ao realizar cadastro. Por favor, tente novamente.");
      toast.error("Erro ao realizar cadastro.");
      setIsSubmitting(false);
    }
  }

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          {registrationError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {registrationError}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PersonalInfoFields />
            <LocationFields />
            <ContactFields />
          </div>

          <TermsField />

          <GradientButton 
            type="submit" 
            className="w-full py-6"
            disabled={isSubmitting || rateLimitTimer !== null}
          >
            {isSubmitting ? "Processando..." : "Descobrir meu Perfil"}
          </GradientButton>
        </form>
      </Form>
    </FormProvider>
  );
};

export default RegisterForm;
