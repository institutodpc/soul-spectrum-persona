
import React from "react";
import { Button } from "@/components/ui/button";
import GradientButton from "@/components/ui-custom/GradientButton";

interface DiagnosticNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  selectedOption: string | null;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const DiagnosticNavigation = ({
  currentQuestion,
  totalQuestions,
  selectedOption,
  isSubmitting,
  onPrevious,
  onNext,
}: DiagnosticNavigationProps) => {
  return (
    <div className="flex justify-between pt-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentQuestion === 0}
      >
        Anterior
      </Button>
      <GradientButton 
        onClick={onNext} 
        disabled={!selectedOption || isSubmitting}
      >
        {currentQuestion < totalQuestions - 1 ? "Próxima" : "Finalizar"}
      </GradientButton>
    </div>
  );
};

export default DiagnosticNavigation;
