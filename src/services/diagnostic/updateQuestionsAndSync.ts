
import { syncQuestions } from "@/scripts/syncQuestions";

export const updateQuestionsAndSync = async () => {
  try {
    console.log('🔄 Iniciando atualização e sincronização das perguntas...');
    
    // Executar a sincronização diretamente
    const result = await syncQuestions();
    
    if (result.success) {
      console.log('✅ Perguntas atualizadas e sincronizadas com sucesso!');
      return {
        success: true,
        message: 'Perguntas atualizadas com nova linguagem mais simples e sincronizadas no Supabase!'
      };
    } else {
      console.error('❌ Erro na sincronização:', result.message);
      return {
        success: false,
        message: result.message
      };
    }
  } catch (error) {
    console.error('💥 Erro ao atualizar e sincronizar:', error);
    return {
      success: false,
      message: 'Erro inesperado durante a atualização'
    };
  }
};
