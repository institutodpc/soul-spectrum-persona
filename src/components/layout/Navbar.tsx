
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Você saiu com sucesso");
    navigate("/");
  };
  
  return (
    <header className="fixed w-full top-0 z-20 backdrop-blur-lg bg-background/50 border-b border-border/50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold holographic-text">
          Perfis DPC
        </Link>
        
        <nav>
          <ul className="flex items-center space-x-4">
            <li>
              <Link to="/" className="hover:text-primary transition-colors">
                Início
              </Link>
            </li>
            
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/diagnostic" className="hover:text-primary transition-colors">
                    Diagnóstico
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="hover:text-primary transition-colors"
                  >
                    Sair
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/register" className="hover:text-primary transition-colors">
                  Cadastro
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
