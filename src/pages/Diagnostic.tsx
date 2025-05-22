
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassmorphicCard from "@/components/ui-custom/GlassmorphicCard";
import GradientButton from "@/components/ui-custom/GradientButton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Sample questions for demonstration
const questions = [
  {
    id: 1,
    text: "Com que frequência você se sente ansioso(a) com relação ao futuro?",
    options: [
      { id: "a", text: "Quase nunca" },
      { id: "b", text: "Ocasionalmente" },
      { id: "c", text: "Frequentemente" },
      { id: "d", text: "Quase sempre" },
    ],
  },
  {
    id: 2,
    text: "Você costuma adiar decisões importantes até o último momento?",
    options: [
      { id: "a", text: "Raramente" },
      { id: "b", text: "Às vezes" },
      { id: "c", text: "Frequentemente" },
      { id: "d", text: "Quase sempre" },
    ],
  },
  {
    id: 3,
    text: "Você se sente criticado(a) pelos outros com frequência?",
    options: [
      { id: "a", text: "Raramente" },
      { id: "b", text: "Às vezes" },
      { id: "c", text: "Frequentemente" },
      { id: "d", text: "Quase sempre" },
    ],
  },
  {
    id: 4,
    text: "Como você lida com erros que comete?",
    options: [
      { id: "a", text: "Aceito e aprendo com eles" },
      { id: "b", text: "Tento corrigir, mas fico frustrado(a)" },
      { id: "c", text: "Fico muito crítico(a) comigo mesmo(a)" },
      { id: "d", text: "Tento esconder ou justificar meus erros" },
    ],
  },
  {
    id: 5,
    text: "Você sente que precisa controlar situações ao seu redor?",
    options: [
      { id: "a", text: "Raramente" },
      { id: "b", text: "Às vezes" },
      { id: "c", text: "Frequentemente" },
      { id: "d", text: "Quase sempre" },
    ],
  },
];

const Diagnostic = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };
  
  const handleNext = () => {
    if (selectedOption) {
      // Save the current answer
      setAnswers({
        ...answers,
        [questions[currentQuestion].id]: selectedOption,
      });
      
      // Move to next question or finish
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        // Process answers and navigate to results
        navigate("/results");
      }
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      // Restore previous answer if available
      setSelectedOption(answers[questions[currentQuestion - 1].id] || null);
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
              <h2 className="text-xl font-medium">{currentQuestionData.text}</h2>
              
              <div className="space-y-4">
                {currentQuestionData.options.map((option) => (
                  <div 
                    key={option.id} 
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedOption === option.id 
                        ? "border-dpc-pink bg-dpc-pink/5" 
                        : "border-border hover:border-dpc-coral/50"
                    }`}
                    onClick={() => handleOptionSelect(option.id)}
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
                      <span>{option.text}</span>
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
                  disabled={!selectedOption}
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
