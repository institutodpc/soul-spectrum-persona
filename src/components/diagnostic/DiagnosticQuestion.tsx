
import React from "react";
import { Question } from "@/types/diagnostic";

interface DiagnosticQuestionProps {
  question: Question;
  selectedOption: string | null;
  onOptionSelect: (optionId: string, question: Question) => void;
}

const DiagnosticQuestion = ({
  question,
  selectedOption,
  onOptionSelect,
}: DiagnosticQuestionProps) => {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-medium">{question.texto}</h2>
      
      <div className="space-y-4">
        {question.opcoes.map((option) => (
          <div 
            key={option.id} 
            className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
              selectedOption === option.id 
                ? "border-2 border-dpc-pink bg-dpc-pink/5 shadow-md" 
                : "border-border hover:border-dpc-coral/50"
            }`}
            onClick={() => onOptionSelect(option.id, question)}
            role="button"
            aria-pressed={selectedOption === option.id}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onOptionSelect(option.id, question);
              }
            }}
          >
            <div className="flex items-center">
              <div 
                className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                  selectedOption === option.id 
                    ? "border-2 border-dpc-pink" 
                    : "border-gray-400"
                }`}
              >
                {selectedOption === option.id && (
                  <div className="w-3 h-3 rounded-full bg-dpc-pink animate-pulse" />
                )}
              </div>
              <span className={`${selectedOption === option.id ? "font-medium text-dpc-pink" : ""}`}>
                {option.texto}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiagnosticQuestion;
