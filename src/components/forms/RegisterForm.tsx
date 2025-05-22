
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

const RegisterForm = () => {
  const navigate = useNavigate();
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
      console.log(values);
      
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
        throw authError;
      }

      toast.success("Cadastro realizado com sucesso!");
      
      // Redirecionar para a página de diagnóstico imediatamente
      navigate("/diagnostic");
    } catch (error) {
      console.error("Erro ao realizar cadastro:", error);
      toast.error("Erro ao realizar cadastro. Por favor, tente novamente.");
    }
  }

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
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
