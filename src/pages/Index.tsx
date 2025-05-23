
import React from "react";
import { useNavigate } from "react-router-dom";
import GradientButton from "@/components/ui-custom/GradientButton";
import GlassmorphicCard from "@/components/ui-custom/GlassmorphicCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Index = () => {
  const navigate = useNavigate();
  
  const handleStartClick = () => {
    navigate('/register');
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
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-4xl w-full space-y-12 py-12">
          {/* Hero section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight holographic-text text-center px-0 mx-[120px] md:text-6xl">
              Descubra qual Perfil está vivendo hoje!
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl max-w-3xl mx-auto">
              Descubra qual perfil espiritual está te influenciando hoje
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassmorphicCard className="flex flex-col items-center text-center p-6 animate-float">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Cadastre-se</h3>
              <p className="text-sm text-muted-foreground">
                Responda algumas perguntas rápidas sobre você
              </p>
            </GlassmorphicCard>

            <GlassmorphicCard className="flex flex-col items-center text-center p-6 animate-float [animation-delay:0.5s]">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Complete o Diagnóstico</h3>
              <p className="text-sm text-muted-foreground">
                Responda nosso questionário espiritual guiado
              </p>
            </GlassmorphicCard>

            <GlassmorphicCard className="flex flex-col items-center text-center p-6 animate-float [animation-delay:1s]">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Receba seu Perfil</h3>
              <p className="text-sm text-muted-foreground">
                Conheça seu perfil espiritual atual e como ele te influencia
              </p>
            </GlassmorphicCard>
          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <GradientButton onClick={handleStartClick} className="text-lg px-10 py-7">
              Descobrir meu Perfil
            </GradientButton>
          </div>

          {/* Information section */}
          <GlassmorphicCard className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Sobre os 33 Perfis</h2>
            <p className="mb-6">
              Os 33 perfis espirituais são características que influenciam nossos comportamentos, 
              decisões e destino. Identificar qual perfil está predominante em você 
              neste momento é o primeiro passo para crescimento espiritual.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["O Lamentador", "O Perfeccionista", "O Procrastinador", "O Inseguro", "O Controlador", "O Mentiroso", "O Hipócrita", "O Invejoso", "O Orgulhoso", "O Vitimista"].map(perfil => (
                <span key={perfil} className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20">
                  {perfil}
                </span>
              ))}
              <span className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20">
                E outros 23 perfis...
              </span>
            </div>
          </GlassmorphicCard>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
