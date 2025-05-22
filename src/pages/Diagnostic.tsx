
import React, { useEffect } from "react";
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

const Diagnostic = () => {
  const navigate = useNavigate();

  // Fetch questions using React Query
  const { data: questions, isLoading, error } = useQuery({
    queryKey: ['questions'],
    queryFn: fetchQuestions,
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
  } = useDiagnostic(questions);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Por favor, faça login para continuar o diagnóstico");
        navigate("/register");
      }
    };
    
    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg">Carregando perguntas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg text-red-500">Erro ao carregar perguntas. Por favor, tente novamente.</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg text-amber-500">Nenhuma pergunta encontrada.</p>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

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
