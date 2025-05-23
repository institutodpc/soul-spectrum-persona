
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/components/forms/register/schema";

export const useRegister = () => {
  const navigate = useNavigate();
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (values: FormValues) => {
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
      
      // Try to sign up without email confirmation
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: cleanWhatsApp,
        options: {
          data: userData,
          emailRedirectTo: undefined // Remove any email confirmation redirect
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
        
        // Since email confirmation is disabled, user should be automatically logged in
        // Check if session exists, if not, try to sign in
        if (authData.session) {
          console.log("Usuário logado automaticamente");
          navigate("/diagnostic");
        } else {
          console.log("Tentando fazer login automático");
          // Try to sign in immediately
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: cleanWhatsApp,
          });
          
          if (signInError) {
            console.error("Erro no login automático:", signInError);
            toast.info("Cadastro realizado! Tente fazer login com seus dados.");
          } else {
            console.log("Login automático realizado");
            toast.success("Cadastro e login realizados com sucesso!");
            navigate("/diagnostic");
          }
        }
      } else {
        throw new Error("Usuário não foi criado corretamente");
      }
      
    } catch (error: any) {
      console.error("Erro durante cadastro:", error);
      setRegistrationError("Erro inesperado durante o cadastro. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  return {
    registrationError,
    isSubmitting,
    handleRegister,
    setRegistrationError
  };
};
