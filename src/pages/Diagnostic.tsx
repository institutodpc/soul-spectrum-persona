
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

  // Fetch questions with more detailed configuration
  const { data: questions, isLoading, error, refetch } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      console.log('🚀 Query: Iniciando fetchQuestions...');
      const result = await fetchQuestions();
      console.log('✅ Query: fetchQuestions concluído:', result?.length, 'perguntas');
      return result;
    },
    retry: (failureCount, error) => {
      console.log(`🔄 Query: Tentativa ${failureCount + 1} falhou:`, error);
      return failureCount < 2; // Tentar até 3 vezes
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos (anteriormente cacheTime)
  });

  // Use our custom hook for diagnostic logic
  const {
    currentQuestion,
    totalQuestions,
    selectedOption,
    isSubmitting,
    handleOptionSelect,
    handleNext,
    handlePrevious,
    answers,
  } = useDiagnostic(questions);

  useEffect(() => {
    console.log('🔐 Iniciando verificação de autenticação...');
    
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erro ao obter sessão:', error);
          toast.error("Erro ao verificar sua autenticação. Por favor, tente novamente.");
          navigate("/register");
          return;
        }
        
        if (!session) {
          console.log('⚠️ Nenhuma sessão encontrada, redirecionando...');
          toast.error("Por favor, faça login para continuar o diagnóstico");
          navigate("/register");
          return;
        }

        console.log('✅ Usuário autenticado:', session.user.email);

        // Setup auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
          console.log('🔄 Mudança no estado de auth:', event);
          if (event === 'SIGNED_OUT' || !currentSession) {
            console.log('🚪 Usuário deslogado');
            toast.error("Sua sessão expirou. Por favor, faça login novamente.");
            localStorage.removeItem('diagnostic_answers');
            navigate("/register");
          }
        });
        
        setIsAuthChecked(true);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("💥 Erro crítico na verificação de autenticação:", error);
        toast.error("Erro ao verificar sua autenticação. Por favor, tente novamente.");
        navigate("/register");
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleRetryFetch = () => {
    console.log('🔄 Usuário solicitou retry...');
    refetch();
  };

  // Debug logs para entender o estado atual
  console.log('🔍 Estado atual:', {
    isAuthChecked,
    isLoading,
    hasError: !!error,
    questionsLength: questions?.length,
    currentQuestion,
    totalQuestions
  });

  // Show loading while checking auth
  if (!isAuthChecked) {
    console.log('⏳ Aguardando verificação de auth...');
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Verificando autenticação...</p>
      </div>
    );
  }

  // Show loading while fetching questions
  if (isLoading) {
    console.log('⏳ Carregando perguntas...');
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Carregando perguntas...</p>
        <p className="mt-2 text-sm text-gray-500">Verificando banco de dados...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    console.error("💥 Erro ao carregar perguntas:", error);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <p className="text-lg text-red-500 mb-4">Erro ao carregar perguntas</p>
          <p className="text-sm text-gray-500 mb-4">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </p>
          <div className="space-y-2">
            <Button onClick={handleRetryFetch} className="w-full">
              Tentar novamente
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/register")} 
              className="w-full"
            >
              Voltar para o cadastro
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check if questions exist
  if (!questions || questions.length === 0) {
    console.warn('⚠️ Nenhuma pergunta disponível');
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <p className="text-lg text-amber-500 mb-4">Nenhuma pergunta encontrada</p>
          <p className="text-sm text-gray-500 mb-4">
            As perguntas do diagnóstico não estão disponíveis no momento.
          </p>
          <div className="space-y-2">
            <Button onClick={handleRetryFetch} className="w-full">
              Tentar carregar novamente
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/register")} 
              className="w-full"
            >
              Voltar para o cadastro
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check current question
  const currentQuestionData = questions[currentQuestion];
  if (!currentQuestionData) {
    console.error('❌ Pergunta atual não encontrada:', { currentQuestion, totalQuestions });
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <p className="text-lg text-red-500 mb-4">Erro na pergunta atual</p>
          <p className="text-sm text-gray-500 mb-4">
            Pergunta {currentQuestion + 1} de {totalQuestions} não encontrada.
          </p>
          <Button onClick={() => navigate("/register")} className="w-full">
            Voltar para o cadastro
          </Button>
        </div>
      </div>
    );
  }

  console.log('✅ Renderizando diagnóstico:', {
    perguntaAtual: currentQuestion + 1,
    total: totalQuestions,
    temOpcoes: currentQuestionData.opcoes?.length
  });

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-dpc-pink/10 via-dpc-coral/10 to-purple-500/10 animate-background-gradient"></div>
        <div className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full bg-dpc-pink/20 blur-3xl animate-pulse-light"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-dpc-coral/20 blur-3xl animate-float"></div>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main content */}
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Diagnostic;
