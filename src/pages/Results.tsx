
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassmorphicCard from "@/components/ui-custom/GlassmorphicCard";
import GradientButton from "@/components/ui-custom/GradientButton";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Sample profile result for demonstration
const profileResult = {
  nome: "O Perfeccionista",
  emocaoPredominante: "Ansiedade e autocrítica",
  influenciaDecisoes: "Tende a adiar decisões por medo de cometer erros, busca sempre a opção perfeita.",
  afetaDestino: "Limitação de oportunidades por medo de falhar ou ser julgado(a).",
  licaoEspiritual: "Aprender que o crescimento vem através dos erros e imperfeições.",
  demonioAssociado: "Espírito de controle e rigidez",
  comoOpera: "Instiga pensamentos de que nada que você faz é bom o suficiente.",
  artimanhaUtilizada: "Faz você acreditar que só será aceito(a) quando for perfeito(a).",
  refugioQueProcura: "Controle excessivo e padrões inalcançáveis.",
  personagemBiblico: "Marta (irmã de Maria e Lázaro)",
  comoDeusExaltou: "Jesus ensinou Marta sobre a importância de estar em sua presença antes de servir perfeitamente.",
  formacaoPerfil: "Geralmente formado na infância através de pressões familiares por excelência ou críticas constantes.",
  doresComum: "Ansiedade, estresse, sentimento de inadequação e exaustão emocional."
};

const ResultItem = ({ label, value }: { label: string; value: string }) => (
  <div className="mb-4">
    <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
    <p className="mt-1">{value}</p>
  </div>
);

const Results = () => {
  const handleDownloadPDF = () => {
    // In a real implementation, this would generate and download a PDF
    toast.success("Seu diagnóstico está sendo preparado para download!");
  };
  
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
              <h1 className="text-3xl font-bold holographic-text mb-2">{profileResult.nome}</h1>
              <p className="text-muted-foreground">
                Este é o perfil espiritual que está predominante em sua vida neste momento
              </p>
            </div>

            <Separator className="my-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <ResultItem label="Emoção Predominante" value={profileResult.emocaoPredominante} />
                <ResultItem label="Como influencia nas decisões" value={profileResult.influenciaDecisoes} />
                <ResultItem label="Como afeta o destino" value={profileResult.afetaDestino} />
                <ResultItem label="Lição espiritual" value={profileResult.licaoEspiritual} />
                <ResultItem label="Demônio associado" value={profileResult.demonioAssociado} />
                <ResultItem label="Como ele opera" value={profileResult.comoOpera} />
              </div>
              <div>
                <ResultItem label="Artimanha utilizada" value={profileResult.artimanhaUtilizada} />
                <ResultItem label="Refúgio que procura" value={profileResult.refugioQueProcura} />
                <ResultItem label="Personagem bíblico" value={profileResult.personagemBiblico} />
                <ResultItem label="Como Deus o exaltou" value={profileResult.comoDeusExaltou} />
                <ResultItem label="Formação do perfil" value={profileResult.formacaoPerfil} />
                <ResultItem label="Dores em comum" value={profileResult.doresComum} />
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
