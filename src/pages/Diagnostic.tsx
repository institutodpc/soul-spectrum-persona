
import React from "react";
import { useQuery } from "@tanstack/react-query";
import DiagnosticQuestion from "@/components/diagnostic/DiagnosticQuestion";
import DiagnosticProgress from "@/components/diagnostic/DiagnosticProgress";
import DiagnosticNavigation from "@/components/diagnostic/DiagnosticNavigation";
import UpdateQuestionsButton from "@/components/admin/UpdateQuestionsButton";
import { fetchQuestions } from "@/services/diagnosticService";
import { useDiagnostic } from "@/hooks/use-diagnostic";

const Diagnostic = () => {
  const { data: questions, isLoading, error } = useQuery({
    queryKey: ["questions"],
    queryFn: fetchQuestions,
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dpc-mint via-white to-dpc-coral/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dpc-pink mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perguntas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dpc-mint via-white to-dpc-coral/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar perguntas</p>
          <UpdateQuestionsButton />
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dpc-mint via-white to-dpc-coral/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Nenhuma pergunta encontrada</p>
          <UpdateQuestionsButton />
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dpc-mint via-white to-dpc-coral/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Admin button - temporary */}
          <div className="mb-4 text-center">
            <UpdateQuestionsButton />
          </div>

          <DiagnosticProgress 
            currentQuestion={currentQuestion + 1} 
            totalQuestions={totalQuestions} 
          />
          
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <DiagnosticQuestion
              question={currentQuestionData}
              selectedOption={selectedOption}
              onOptionSelect={handleOptionSelect}
            />
          </div>
          
          <DiagnosticNavigation
            currentQuestion={currentQuestion}
            totalQuestions={totalQuestions}
            selectedOption={selectedOption}
            isSubmitting={isSubmitting}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>
      </div>
    </div>
  );
};

export default Diagnostic;
