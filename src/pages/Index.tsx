
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassmorphicCard from "@/components/ui-custom/GlassmorphicCard";
import GradientButton from "@/components/ui-custom/GradientButton";
import DatabaseDebug from "@/components/debug/DatabaseDebug";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const Index = () => {
  const navigate = useNavigate();
  
  // Check if user is already logged in and redirect
  useAuthRedirect();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-dpc-pink/10 via-dpc-coral/10 to-purple-500/10 animate-background-gradient"></div>
        <div className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full bg-dpc-pink/20 blur-3xl animate-pulse-light"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-dpc-coral/20 blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-purple-500/10 blur-2xl animate-bounce-light"></div>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <GlassmorphicCard className="p-8 md:p-12">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold holographic-text">
                Descubra Seu Perfil DPC
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Um diagnóstico personalizado para identificar seu perfil comportamental e espiritual, 
                baseado nos ensinamentos da Doutrina do Progresso Cristão.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <GradientButton 
                  onClick={() => navigate("/register")}
                  className="px-8 py-3 text-lg"
                >
                  Começar Diagnóstico
                </GradientButton>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Seção de Debug - Temporária */}
          <div className="mt-8">
            <DatabaseDebug />
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <GlassmorphicCard className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-dpc-pink to-dpc-coral rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold">Diagnóstico Preciso</h3>
                <p className="text-muted-foreground">
                  Questionário baseado em anos de estudos e prática da DPC para identificar seu perfil único.
                </p>
              </div>
            </GlassmorphicCard>

            <GlassmorphicCard className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-dpc-coral to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold">Análise Detalhada</h3>
                <p className="text-muted-foreground">
                  Receba insights profundos sobre seus padrões comportamentais e areas de crescimento.
                </p>
              </div>
            </GlassmorphicCard>

            <GlassmorphicCard className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-dpc-pink rounded-full flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold">Transformação</h3>
                <p className="text-muted-foreground">
                  Orientações práticas para seu desenvolvimento espiritual e pessoal baseado no seu perfil.
                </p>
              </div>
            </GlassmorphicCard>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
