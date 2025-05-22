
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
      setRegistrationError(null);
      console.log(values);
      
      // Verificar se o usuário já existe
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', values.email)
        .maybeSingle();
      
      if (checkError) {
        console.error("Erro ao verificar usuário existente:", checkError);
        throw new Error("Erro ao verificar dados. Por favor, tente novamente.");
      }
      
      if (existingUsers) {
        setRegistrationError("Este e-mail já está cadastrado. Por favor, tente fazer login.");
        return;
      }
      
      // Registrar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.whatsapp.replace(/\D/g, ''), // Usando o WhatsApp como senha (simplificado)
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
        throw new Error("Erro ao criar usuário.");
      }

      toast.success("Cadastro realizado com sucesso!");
      
      // Redirecionar para a página de diagnóstico imediatamente
      navigate("/diagnostic");
    } catch (error: any) {
      console.error("Erro ao realizar cadastro:", error);
      setRegistrationError(error.message || "Erro ao realizar cadastro. Por favor, tente novamente.");
      toast.error("Erro ao realizar cadastro.");
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

          <GradientButton type="submit" className="w-full py-6">
            Descobrir meu Perfil
          </GradientButton>
        </form>
      </Form>
    </FormProvider>
  );
};

export default RegisterForm;
