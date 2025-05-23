
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassmorphicCard from "@/components/ui-custom/GlassmorphicCard";
import { Button } from "@/components/ui/button";
import { fetchQuestions } from "@/services/diagnosticService";
import { supabase } from "@/integrations/supabase/client";
import DiagnosticProgress from "@/components/diagnostic/DiagnosticProgress";
import DiagnosticQuestion from "@/components/diagnostic/DiagnosticQuestion";
import DiagnosticNavigation from "@/components/diagnostic/DiagnosticNavigation";
import { useDiagnostic } from "@/hooks/use-diagnostic";
import { Loader2 } from "lucide-react";

const Diagnostic = () => {
  const navigate = useNavigate();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Buscar perguntas
  const { data: questions, isLoading, error, refetch } = useQuery({
    queryKey: ['questions'],
    queryFn: fetchQuestions,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });

  // Hook do diagnóstico
  const {
    currentQuestion,
    totalQuestions,
    selectedOption,
    isSubmitting,
    handleOptionSelect,
    handleNext,
    handlePrevious,
  } = useDiagnostic(questions);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔐 Verificando autenticação...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.warn('❌ Usuário não autenticado');
          toast.error("Por favor, faça login para continuar o diagnóstico");
          navigate("/register");
          return;
        }
        
        console.log('✅ Usuário autenticado:', session.user.email);
        setIsAuthChecked(true);
        
        // Listener para mudanças de auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
          console.log('🔄 Auth state changed:', event);
          if (event === 'SIGNED_OUT' || !currentSession) {
            toast.error("Sua sessão expirou. Por favor, faça login novamente.");
            localStorage.removeItem('diagnostic_answers');
            navigate("/register");
          }
        });
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("💥 Erro ao verificar autenticação:", error);
        toast.error("Erro ao verificar sua autenticação. Por favor, tente novamente.");
        navigate("/register");
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Loading de autenticação
  if (!isAuthChecked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Verificando autenticação...</p>
      </div>
    );
  }

  // Loading de perguntas
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Carregando perguntas...</p>
      </div>
    );
  }

  // Erro ao carregar perguntas
  if (error) {
    console.error("💥 Erro ao carregar perguntas:", error);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg text-red-500 mb-4">Erro ao carregar perguntas.</p>
        <p className="text-sm text-gray-500 mb-4">
          Detalhes: {error instanceof Error ? error.message : 'Erro desconhecido'}
        </p>
        <Button onClick={() => refetch()} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    );
  }

  // Sem perguntas
  if (!questions || questions.length === 0) {
    console.warn('⚠️ Nenhuma pergunta disponível');
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg text-amber-500 mb-4">Nenhuma pergunta encontrada.</p>
        <Button onClick={() => navigate("/register")} className="mt-4">
          Voltar para o cadastro
        </Button>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  if (!currentQuestionData) {
    console.error('💥 Pergunta atual não encontrada:', { currentQuestion, totalQuestions });
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg text-red-500 mb-4">Erro: Pergunta não encontrada.</p>
        <Button onClick={() => navigate("/register")} className="mt-4">
          Voltar para o cadastro
        </Button>
      </div>
    );
  }

  console.log('✅ Renderizando pergunta:', {
    current: currentQuestion + 1,
    total: totalQuestions,
    questionId: currentQuestionData.id,
    optionsCount: currentQuestionData.opcoes?.length || 0
  });

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-dpc-pink/10 via-dpc-coral/10 to-purple-500/10 animate-background-gradient"></div>
        <div className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full bg-dpc-pink/20 blur-3xl animate-pulse-light"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-dpc-coral/20 blur-3xl animate-float"></div>
      </div>

      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="max-w-3xl w-full">
          <GlassmorphicCard className="p-6 md:p-8">
            <DiagnosticProgress 
              currentQuestion={currentQuestion} 
              totalQuestions={totalQuestions} 
            />

            <DiagnosticQuestion 
              question={currentQuestionData} 
              selectedOption={selectedOption} 
              onOptionSelect={handleOptionSelect} 
            />
            
            <DiagnosticNavigation 
              currentQuestion={currentQuestion}
              totalQuestions={totalQuestions}
              selectedOption={selectedOption}
              isSubmitting={isSubmitting}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          </GlassmorphicCard>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Diagnostic;
