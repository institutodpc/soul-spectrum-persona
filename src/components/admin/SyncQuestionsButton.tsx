
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { syncQuestions } from "@/scripts/syncQuestions";
import { Loader2 } from "lucide-react";

const SyncQuestionsButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSyncQuestions = async () => {
    setIsLoading(true);
    try {
      const result = await syncQuestions();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error syncing questions:", error);
      toast.error("Erro ao sincronizar perguntas.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={handleSyncQuestions} 
      disabled={isLoading} 
      variant="outline"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sincronizando...
        </>
      ) : (
        "Sincronizar Perguntas"
      )}
    </Button>
  );
};

export default SyncQuestionsButton;
