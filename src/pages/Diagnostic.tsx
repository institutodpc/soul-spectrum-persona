
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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Fetch questions using React Query
  const { data: questions, isLoading, error, refetch } = useQuery({
    queryKey: ['questions'],
    queryFn: fetchQuestions,
    // Don't fetch until we've checked authentication
    enabled: !isCheckingAuth,
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutos
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
    // Check authentication
    const checkAuth = async () => {
      setIsCheckingAuth(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Por favor, faça login para continuar o diagnóstico");
          navigate("/register");
          return;
        }
        // Setup auth state listener to handle session changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
          if (event === 'SIGNED_OUT' || !currentSession) {
            toast.error("Sua sessão expirou. Por favor, faça login novamente.");
            localStorage.removeItem('diagnostic_answers'); // Limpar respostas salvas
            navigate("/register");
          }
        });
        
        setIsCheckingAuth(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        toast.error("Erro ao verificar sua autenticação. Por favor, tente novamente.");
        navigate("/register");
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Enable refetch when isCheckingAuth becomes false
  useEffect(() => {
    if (!isCheckingAuth) {
      refetch();
    }
  }, [isCheckingAuth, refetch]);

  const handleRetryFetch = () => {
    refetch();
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Verificando autenticação...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Carregando perguntas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg text-red-500">Erro ao carregar perguntas. Por favor, tente novamente.</p>
        <Button onClick={handleRetryFetch} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg text-amber-500">Nenhuma pergunta encontrada.</p>
        <Button onClick={() => navigate("/register")} className="mt-4">
          Voltar para o cadastro
        </Button>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const progress = Math.round((answers.length / totalQuestions) * 100);

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
