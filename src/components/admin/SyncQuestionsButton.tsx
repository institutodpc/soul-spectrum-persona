
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { syncQuestions } from "@/scripts/syncQuestions";
import { Loader2 } from "lucide-react";

const SyncQuestionsButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [syncCount, setSyncCount] = useState({ perguntas: 0, alternativas: 0 });
  
  const handleSyncQuestions = async () => {
    setIsLoading(true);
    setSyncCount({ perguntas: 0, alternativas: 0 });
    
    try {
      const result = await syncQuestions();
      
      if (result.success) {
        toast.success(result.message);
        setSyncCount({ 
          perguntas: result.stats?.perguntas?.success || 0, 
          alternativas: result.stats?.alternativas?.success || 0 
        });
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
    <div className="space-y-2">
      <Button 
        onClick={handleSyncQuestions} 
        disabled={isLoading} 
        variant="outline"
        className="w-full"
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
      
      {syncCount.perguntas > 0 && (
        <div className="text-sm text-muted-foreground">
          <p>Última sincronização:</p>
          <p>{syncCount.perguntas} perguntas</p>
          <p>{syncCount.alternativas} alternativas</p>
        </div>
      )}
    </div>
  );
};

export default SyncQuestionsButton;
