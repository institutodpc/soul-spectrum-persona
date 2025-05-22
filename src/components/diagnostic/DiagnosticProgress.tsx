
import React from "react";
import { Progress } from "@/components/ui/progress";

interface DiagnosticProgressProps {
  currentQuestion: number;
  totalQuestions: number;
}

const DiagnosticProgress = ({
  currentQuestion,
  totalQuestions,
}: DiagnosticProgressProps) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2 text-sm">
        <span>Questão {currentQuestion + 1} de {totalQuestions}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default DiagnosticProgress;
