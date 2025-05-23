
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

  // Check if user is already logged in and redirect if needed
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
      setIsSubmitting(true);
      setRegistrationError(null);
      
      console.log("Iniciando cadastro com:", values);
      
      // Format WhatsApp for password
      const cleanWhatsApp = values.whatsapp.replace(/\D/g, '');
      
      if (cleanWhatsApp.length < 11) {
        setRegistrationError("WhatsApp deve ter pelo menos 11 dígitos com DDD.");
        setIsSubmitting(false);
        return;
      }
      
      // Prepare user metadata
      const userData = {
        nome: values.nome,
        sobrenome: values.sobrenome,
        whatsapp: values.whatsapp,
        data_nascimento: values.dataNascimento ? values.dataNascimento.toISOString() : null,
        sexo: values.sexo || null,
        estado: values.estado || null,
        cidade: values.cidade || null,
        congregacao: values.congregacao || null
      };
      
      console.log("Dados do usuário:", userData);
      
      // Try to sign up
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: cleanWhatsApp,
        options: {
          data: userData,
        },
      });

      if (authError) {
        console.error("Erro de cadastro:", authError);
        
        // Handle specific errors
        if (authError.message.includes("User already registered")) {
          // Try to sign in instead
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: cleanWhatsApp,
          });
          
          if (signInError) {
            setRegistrationError("Email já cadastrado. Verifique seus dados e tente novamente.");
          } else {
            toast.success("Login realizado com sucesso!");
            navigate("/diagnostic");
            return;
          }
        } else {
          setRegistrationError("Erro ao realizar cadastro: " + authError.message);
        }
        
        setIsSubmitting(false);
        return;
      }

      console.log("Cadastro realizado:", authData);
      
      if (authData.user) {
        toast.success("Cadastro realizado com sucesso!");
        
        // If user is immediately confirmed, redirect to diagnostic
        if (authData.session) {
          console.log("Usuário logado automaticamente");
          navigate("/diagnostic");
        } else {
          console.log("Aguardando confirmação de email");
          toast.info("Verifique seu email para confirmar o cadastro.");
          // Still redirect to diagnostic as we've disabled email confirmation
          navigate("/diagnostic");
        }
      } else {
        throw new Error("Usuário não foi criado corretamente");
      }
      
    } catch (error: any) {
      console.error("Erro durante cadastro:", error);
      setRegistrationError("Erro inesperado durante o cadastro. Tente novamente.");
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processando cadastro..." : "Descobrir meu Perfil"}
          </GradientButton>
        </form>
      </Form>
    </FormProvider>
  );
};

export default RegisterForm;
