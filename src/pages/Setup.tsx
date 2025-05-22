
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassmorphicCard from "@/components/ui-custom/GlassmorphicCard";
import GradientButton from "@/components/ui-custom/GradientButton";
import SeedProfilesButton from "@/components/admin/SeedProfilesButton";

const Setup = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <GlassmorphicCard className="p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Configuração Inicial</h1>
            
            <div className="space-y-6">
              <div className="p-4 border rounded-lg">
                <h2 className="font-semibold mb-2">1. Adicionar Perfis Exemplo</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Clique no botão abaixo para adicionar alguns perfis exemplo ao banco de dados.
                </p>
                <SeedProfilesButton />
              </div>
              
              <div className="p-4 border rounded-lg">
                <h2 className="font-semibold mb-2">2. Próximos Passos</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Após adicionar os perfis, você pode começar a usar o diagnóstico espiritual.
                </p>
                <GradientButton onClick={() => navigate("/diagnostic")} className="w-full">
                  Ir para o Diagnóstico
                </GradientButton>
              </div>
            </div>
          </GlassmorphicCard>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Setup;
