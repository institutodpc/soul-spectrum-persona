
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { updateQuestionsAndSync } from '@/services/diagnosticService';

const UpdateQuestionsButton = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      console.log('🔄 Iniciando atualização das perguntas...');
      const result = await updateQuestionsAndSync();
      
      if (result.success) {
        toast.success(result.message);
        console.log('✅ Atualização concluída com sucesso!');
      } else {
        toast.error(result.message);
        console.error('❌ Erro na atualização:', result.message);
      }
    } catch (error) {
      console.error('💥 Erro inesperado:', error);
      toast.error('Erro inesperado durante a atualização');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button 
      onClick={handleUpdate} 
      disabled={isUpdating}
      className="bg-blue-600 hover:bg-blue-700"
    >
      {isUpdating ? 'Atualizando...' : 'Atualizar Perguntas no Supabase'}
    </Button>
  );
};

export default UpdateQuestionsButton;
