
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

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);
      setRegistrationError(null);
      console.log("Form values:", values);
      
      // Verificar se o usuário já existe usando auth.signUp
      const { data: checkData, error: checkError } = await supabase.auth.signUp({
        email: values.email,
        password: "check-only",
        options: { emailRedirectTo: window.location.origin }
      });
      
      if (checkError) {
        console.error("Erro ao verificar e-mail:", checkError);
        if (checkError.message.includes("User already registered")) {
          setRegistrationError("Este e-mail já está cadastrado. Por favor, tente fazer login.");
          return;
        } else {
          throw new Error(checkError.message);
        }
      }
      
      // Formatar o número de WhatsApp para ser usado como senha (apenas dígitos)
      const cleanWhatsApp = values.whatsapp.replace(/\D/g, '');
      
      if (cleanWhatsApp.length < 8) {
        setRegistrationError("O número de WhatsApp fornecido é muito curto para ser usado como senha.");
        return;
      }
      
      // Registrar usuário no Supabase Auth
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
        throw new Error("Erro ao realizar cadastro: " + authError.message);
      }

      if (!authData.user) {
        throw new Error("Erro ao criar usuário. Nenhum usuário retornado pela API.");
      }

      toast.success("Cadastro realizado com sucesso!");
      
      // Redirecionar para a página de diagnóstico imediatamente
      navigate("/diagnostic");
    } catch (error: any) {
      console.error("Erro ao realizar cadastro:", error);
      setRegistrationError(error.message || "Erro ao realizar cadastro. Por favor, tente novamente.");
      toast.error("Erro ao realizar cadastro.");
    } finally {
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
            {isSubmitting ? "Processando..." : "Descobrir meu Perfil"}
          </GradientButton>
        </form>
      </Form>
    </FormProvider>
  );
};

export default RegisterForm;
