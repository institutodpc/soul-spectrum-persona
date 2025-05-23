
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useAuthRedirect = () => {
  const navigate = useNavigate();

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
};
