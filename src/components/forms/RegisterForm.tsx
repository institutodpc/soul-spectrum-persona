
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
import { AlertCircle, Loader2 } from "lucide-react";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [registrationError, setRegistrationError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      sobrenome: "",
      sexo: undefined,
      estado: "",
      cidade: "",
      congregacao: "",
      email: "",
      whatsapp: "",
      aceitoTermos: false,
    },
    mode: "onBlur",
  });

  async function onSubmit(values: FormValues) {
    try {
      setIsLoading(true);
      setRegistrationError(null);
      
      // Limpar o número de WhatsApp antes de enviar
      const whatsappClean = values.whatsapp.replace(/\D/g, '');
      
      // Verificar se o usuário já existe
      const { data: checkData, error: checkError } = await supabase.auth.signUp({
        email: values.email,
        password: "check-only",
        options: { emailRedirectTo: window.location.origin }
      });
      
      if (checkError && checkError.message.includes("User already registered")) {
        setRegistrationError("Este e-mail já está cadastrado. Por favor, tente fazer login.");
        setIsLoading(false);
        return;
      }
      
      // Registrar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: whatsappClean, // Usando o WhatsApp como senha (simplificado)
        options: {
          data: {
            nome: values.nome,
            sobrenome: values.sobrenome,
            data_nascimento: values.dataNascimento ? values.dataNascimento.toISOString() : null,
            sexo: values.sexo,
            estado: values.estado,
            cidade: values.cidade,
            congregacao: values.congregacao,
            whatsapp: whatsappClean
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

      // Adicionar dados a tabela de respostas
      const { error: profileError } = await supabase
        .from('respostas')
        .insert({
          user_id: authData.user.id,
          perfis: []
        });

      if (profileError) {
        console.error("Erro ao salvar perfil:", profileError);
        // Não impede o fluxo principal, apenas loga o erro
      }

      toast.success("Cadastro realizado com sucesso!");
      
      // Redirecionar para a página de diagnóstico 
      navigate("/diagnostic");
    } catch (error: any) {
      console.error("Erro ao realizar cadastro:", error);
      setRegistrationError(error.message || "Erro ao realizar cadastro. Por favor, tente novamente.");
      toast.error("Erro ao realizar cadastro.");
    } finally {
      setIsLoading(false);
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
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Informações Pessoais</h2>
              <PersonalInfoFields />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Localização</h2>
              <LocationFields />
            </div>
            
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-xl font-semibold">Contato</h2>
              <ContactFields />
            </div>
          </div>

          <TermsField />

          <GradientButton 
            type="submit" 
            className="w-full py-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processando...</span>
              </div>
            ) : (
              "Descobrir meu Perfil"
            )}
          </GradientButton>
        </form>
      </Form>
    </FormProvider>
  );
};

export default RegisterForm;
