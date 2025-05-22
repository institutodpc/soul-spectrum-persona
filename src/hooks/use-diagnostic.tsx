
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Question, Answer } from "@/types/diagnostic";
import { submitDiagnostic } from "@/services/diagnosticService";

export const useDiagnostic = (questions: Question[] | undefined) => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!questions || questions.length === 0) {
    return {
      currentQuestion,
      totalQuestions: 0,
      selectedOption,
      isSubmitting,
      handleOptionSelect: () => {},
      handleNext: () => {},
      handlePrevious: () => {},
    };
  }

  const totalQuestions = questions.length;

  // Try to restore previous answer if available when the component mounts
  if (answers.length === 0 && questions.length > 0) {
    // Simulate a check for previous answers in local storage or similar
    // This is a placeholder - in a real implementation, you might restore from state management or storage
  }

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
            
            // Show success message before navigating
            toast.success("Diagnóstico concluído com sucesso!");
            
            // Navigate with the result
            navigate("/results", { state: { result } });
          } catch (error) {
            console.error("Error submitting diagnostic:", error);
            toast.error("Houve um erro ao processar seu diagnóstico. Por favor, tente novamente.");
            setIsSubmitting(false);
          }
        }
      }
    } else {
      toast.error("Por favor, selecione uma opção para continuar.");
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

  return {
    currentQuestion,
    totalQuestions,
    selectedOption,
    isSubmitting,
    handleOptionSelect,
    handleNext,
    handlePrevious,
  };
};
