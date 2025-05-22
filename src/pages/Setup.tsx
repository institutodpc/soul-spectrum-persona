
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassmorphicCard from "@/components/ui-custom/GlassmorphicCard";
import SeedProfilesButton from "@/components/admin/SeedProfilesButton";
import SyncQuestionsButton from "@/components/admin/SyncQuestionsButton";

const Setup = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-dpc-pink/10 via-dpc-coral/10 to-purple-500/10 animate-background-gradient"></div>
        <div className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full bg-dpc-pink/20 blur-3xl animate-pulse-light"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-dpc-coral/20 blur-3xl animate-float"></div>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <GlassmorphicCard className="p-6 md:p-8 max-w-2xl w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Configuração do Sistema</h1>
          
          <div className="space-y-6">
            <div className="p-4 border rounded-lg">
              <h2 className="text-xl font-medium mb-4">Perfis</h2>
              <p className="mb-4">Adicione perfis de exemplo para o diagnóstico.</p>
              <SeedProfilesButton />
            </div>
            
            <div className="p-4 border rounded-lg">
              <h2 className="text-xl font-medium mb-4">Perguntas e Alternativas</h2>
              <p className="mb-4">Sincronize as perguntas e alternativas com o banco de dados.</p>
              <SyncQuestionsButton />
            </div>
          </div>
        </GlassmorphicCard>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Setup;
