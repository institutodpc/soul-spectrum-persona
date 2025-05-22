
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassmorphicCard from "@/components/ui-custom/GlassmorphicCard";
import GradientButton from "@/components/ui-custom/GradientButton";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { DiagnosticResult } from "@/types/diagnostic";
import { supabase } from "@/integrations/supabase/client";

const ResultItem = ({ label, value }: { label: string; value: string }) => (
  <div className="mb-4">
    <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
    <p className="mt-1">{value}</p>
  </div>
);

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const diagnosticResult = location.state?.result as DiagnosticResult | undefined;
  
  useEffect(() => {
    // Check if results exist and authentication
    const checkAuth = async () => {
      if (!diagnosticResult) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("Por favor, faça o diagnóstico primeiro");
          navigate("/diagnostic");
        } else {
          toast.error("Não foi possível carregar os resultados");
          navigate("/diagnostic");
        }
      }
    };
    
    checkAuth();
  }, [diagnosticResult, navigate]);

  const handleDownloadPDF = () => {
    // For now just show a toast. We'll implement PDF generation later.
    toast.success("Seu diagnóstico está sendo preparado para download!");
  };
  
  if (!diagnosticResult || !diagnosticResult.perfil) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg">Carregando resultados...</p>
      </div>
    );
  }

  const profile = diagnosticResult.perfil;
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-dpc-pink/10 via-dpc-coral/10 to-purple-500/10 animate-background-gradient"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-dpc-pink/20 blur-3xl animate-pulse-light"></div>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 rounded-full bg-dpc-coral/20 blur-3xl animate-float"></div>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="max-w-4xl w-full">
          <GlassmorphicCard className="p-6 md:p-8">
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-1 text-sm rounded-full bg-gradient-primary text-white mb-4">
                Seu diagnóstico espiritual
              </span>
              <h1 className="text-3xl font-bold holographic-text mb-2">{profile.nome}</h1>
              <p className="text-muted-foreground">
                Este é o perfil espiritual que está predominante em sua vida neste momento
              </p>
            </div>

            <Separator className="my-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <ResultItem label="Emoção Predominante" value={profile.emocao_predominante} />
                <ResultItem label="Como influencia nas decisões" value={profile.influencia} />
                <ResultItem label="Como afeta o destino" value={profile.destino} />
                <ResultItem label="Lição espiritual" value={profile.licao_espiritual} />
                <ResultItem label="Demônio associado" value={profile.demonio_associado} />
                <ResultItem label="Como ele opera" value={profile.operacao} />
              </div>
              <div>
                <ResultItem label="Artimanha utilizada" value={profile.artimanha} />
                <ResultItem label="Refúgio que procura" value={profile.refugio} />
                <ResultItem label="Personagem bíblico" value={profile.personagem_biblico} />
                <ResultItem label="Como Deus o exaltou" value={profile.exaltacao} />
                <ResultItem label="Formação do perfil" value={profile.formacao} />
                <ResultItem label="Dores em comum" value={profile.dores?.join(', ') || ''} />
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <p className="mb-6 text-muted-foreground">
                Baixe seu relatório completo para referência futura e orientação espiritual
              </p>
              <GradientButton onClick={handleDownloadPDF} className="px-8 py-6">
                Baixar meu diagnóstico em PDF
              </GradientButton>
            </div>
          </GlassmorphicCard>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Results;
