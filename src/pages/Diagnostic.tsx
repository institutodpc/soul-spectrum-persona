
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassmorphicCard from "@/components/ui-custom/GlassmorphicCard";
import GradientButton from "@/components/ui-custom/GradientButton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { fetchQuestions, submitDiagnostic } from "@/services/diagnosticService";
import { Question, Answer } from "@/types/diagnostic";
import { supabase } from "@/integrations/supabase/client";

const Diagnostic = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch questions using React Query
  const { data: questions, isLoading, error } = useQuery({
    queryKey: ['questions'],
    queryFn: fetchQuestions,
  });

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

  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  
  const handleOptionSelect = (optionId: string, selectedQuestion: Question) => {
    const selectedOptionData = selectedQuestion.opcoes.find(option => option.id === optionId);
    if (selectedOptionData) {
      setSelectedOption(optionId);
    }
  };
  
  const handleNext = async () => {
    if (selectedOption) {
      const currentQuestionData = questions[currentQuestion];
      const selectedOptionData = currentQuestionData.opcoes.find(option => option.id === selectedOption);
      
      if (selectedOptionData) {
        // Save the current answer
        const newAnswer: Answer = {
          perguntaId: currentQuestionData.id,
          resposta: selectedOptionData.texto,
          perfis: selectedOptionData.perfis,
        };
        
        const updatedAnswers = [...answers, newAnswer];
        setAnswers(updatedAnswers);
        
        // Move to next question or finish
        if (currentQuestion < totalQuestions - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedOption(null);
        } else {
          // Submit all answers and navigate to results
          setIsSubmitting(true);
          try {
            const result = await submitDiagnostic(updatedAnswers);
            navigate("/results", { state: { result } });
          } catch (error) {
            console.error("Error submitting diagnostic:", error);
            toast.error("Houve um erro ao processar seu diagnóstico. Por favor, tente novamente.");
          } finally {
            setIsSubmitting(false);
          }
        }
      }
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      // Remove the last answer
      const updatedAnswers = [...answers];
      updatedAnswers.pop();
      setAnswers(updatedAnswers);
      
      // Restore previous selection if available
      const previousQuestion = questions[currentQuestion - 1];
      const previousAnswer = answers.find(a => a.perguntaId === previousQuestion.id);
      
      if (previousAnswer) {
        const previousOption = previousQuestion.opcoes.find(o => o.texto === previousAnswer.resposta);
        setSelectedOption(previousOption?.id || null);
      } else {
        setSelectedOption(null);
      }
    }
  };

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
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2 text-sm">
                <span>Questão {currentQuestion + 1} de {totalQuestions}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="space-y-8">
              <h2 className="text-xl font-medium">{currentQuestionData.texto}</h2>
              
              <div className="space-y-4">
                {currentQuestionData.opcoes.map((option) => (
                  <div 
                    key={option.id} 
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedOption === option.id 
                        ? "border-dpc-pink bg-dpc-pink/5" 
                        : "border-border hover:border-dpc-coral/50"
                    }`}
                    onClick={() => handleOptionSelect(option.id, currentQuestionData)}
                  >
                    <div className="flex items-center">
                      <div 
                        className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                          selectedOption === option.id 
                            ? "border-dpc-pink" 
                            : "border-gray-400"
                        }`}
                      >
                        {selectedOption === option.id && (
                          <div className="w-3 h-3 rounded-full bg-dpc-pink" />
                        )}
                      </div>
                      <span>{option.texto}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  Anterior
                </Button>
                <GradientButton 
                  onClick={handleNext} 
                  disabled={!selectedOption || isSubmitting}
                >
                  {currentQuestion < totalQuestions - 1 ? "Próxima" : "Finalizar"}
                </GradientButton>
              </div>
            </div>
          </GlassmorphicCard>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Diagnostic;
