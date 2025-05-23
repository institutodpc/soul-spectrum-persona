
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Question, Answer } from "@/types/diagnostic";
import { submitDiagnostic } from "@/services/diagnosticService";
import { supabase } from "@/integrations/supabase/client";

export const useDiagnostic = (questions: Question[] | undefined) => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Early return if no questions
  if (!questions || questions.length === 0) {
    return {
      currentQuestion: 0,
      totalQuestions: 0,
      selectedOption: null,
      isSubmitting: false,
      handleOptionSelect: () => {},
      handleNext: () => {},
      handlePrevious: () => {},
      answers: [],
    };
  }

  const totalQuestions = questions.length;

  // Restaurar respostas anteriores quando as perguntas são carregadas
  useEffect(() => {
    if (answers.length === 0 && questions.length > 0) {
      const savedAnswers = localStorage.getItem('diagnostic_answers');
      if (savedAnswers) {
        try {
          const parsedAnswers = JSON.parse(savedAnswers);
          setAnswers(parsedAnswers);
          
          // Restaurar a posição da pergunta atual baseada nas respostas salvas
          const currentPos = Math.min(parsedAnswers.length, questions.length - 1);
          setCurrentQuestion(currentPos);
          
          // Restaurar a seleção atual se existe
          if (parsedAnswers.length > currentPos) {
            const currentQuestionData = questions[currentPos];
            const savedAnswer = parsedAnswers.find((a: Answer) => a.perguntaId === currentQuestionData.id);
            
            if (savedAnswer) {
              const option = currentQuestionData.opcoes.find(o => o.texto === savedAnswer.resposta);
              if (option) {
                setSelectedOption(option.id);
              }
            }
          }
        } catch (error) {
          console.error("Erro ao restaurar respostas salvas:", error);
          localStorage.removeItem('diagnostic_answers');
        }
      }
    }
  }, [questions, answers.length, currentQuestion]);

  // Salvar respostas no localStorage quando elas mudam
  useEffect(() => {
    if (answers.length > 0) {
      localStorage.setItem('diagnostic_answers', JSON.stringify(answers));
    }
  }, [answers]);

  const handleOptionSelect = (optionId: string, selectedQuestion: Question) => {
    const selectedOptionData = selectedQuestion.opcoes.find(option => option.id === optionId);
    if (selectedOptionData) {
      setSelectedOption(optionId);
    }
  };
  
  const handleNext = async () => {
    if (!selectedOption) {
      toast.error("Por favor, selecione uma opção para continuar.");
      return;
    }

    const currentQuestionData = questions[currentQuestion];
    const selectedOptionData = currentQuestionData.opcoes.find(option => option.id === selectedOption);
    
    if (!selectedOptionData) {
      toast.error("Opção selecionada inválida.");
      return;
    }

    // Verificar se já respondemos esta pergunta
    const existingAnswerIndex = answers.findIndex(a => a.perguntaId === currentQuestionData.id);
    
    const newAnswer: Answer = {
      perguntaId: currentQuestionData.id,
      resposta: selectedOptionData.texto,
      perfis: selectedOptionData.perfis,
    };
    
    let updatedAnswers: Answer[];
    
    if (existingAnswerIndex !== -1) {
      // Atualizar resposta existente
      updatedAnswers = [...answers];
      updatedAnswers[existingAnswerIndex] = newAnswer;
    } else {
      // Adicionar nova resposta
      updatedAnswers = [...answers, newAnswer];
    }
    
    setAnswers(updatedAnswers);
    
    // Move para próxima pergunta ou finaliza
    if (currentQuestion < totalQuestions - 1) {
      const nextQuestionIndex = currentQuestion + 1;
      setCurrentQuestion(nextQuestionIndex);
      
      // Verificar se a próxima pergunta já foi respondida
      const nextQuestion = questions[nextQuestionIndex];
      const nextAnswer = updatedAnswers.find(a => a.perguntaId === nextQuestion.id);
      
      if (nextAnswer) {
        // Restaurar resposta anterior para esta pergunta
        const previousOption = nextQuestion.opcoes.find(o => o.texto === nextAnswer.resposta);
        setSelectedOption(previousOption?.id || null);
      } else {
        setSelectedOption(null);
      }
    } else {
      // Submit all answers and navigate to results
      setIsSubmitting(true);
      try {
        const result = await submitDiagnostic(updatedAnswers);
        
        // Mostrar mensagem de sucesso antes de navegar
        toast.success("Diagnóstico concluído com sucesso!");
        
        // Limpar respostas salvas após conclusão bem-sucedida
        localStorage.removeItem('diagnostic_answers');
        
        // Navegar com o resultado
        navigate("/results", { state: { result } });
      } catch (error) {
        console.error("Error submitting diagnostic:", error);
        
        // Verificar se é erro de autenticação
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Sua sessão expirou. Por favor, faça login novamente.");
          navigate("/register");
          return;
        }
        
        toast.error("Houve um erro ao processar seu diagnóstico. Por favor, tente novamente.");
        setIsSubmitting(false);
      }
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const prevQuestionIndex = currentQuestion - 1;
      setCurrentQuestion(prevQuestionIndex);
      
      // Restaurar seleção anterior se disponível
      const previousQuestion = questions[prevQuestionIndex];
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
    answers,
  };
};
