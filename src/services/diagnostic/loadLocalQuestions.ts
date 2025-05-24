
import { Question } from "@/types/diagnostic";

export const loadLocalQuestions = async (): Promise<Question[]> => {
  try {
    console.log('📁 Carregando perguntas do JSON local...');
    const response = await fetch('/perguntas_dpc_33.json');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const questions = await response.json();
    console.log('✅ Perguntas carregadas do JSON local:', questions?.length || 0);
    
    return questions || [];
  } catch (error) {
    console.error('💥 Erro ao carregar JSON local:', error);
    throw new Error('Falha ao carregar perguntas do arquivo local');
  }
};
