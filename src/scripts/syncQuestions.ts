
import { supabase } from "@/integrations/supabase/client";
import questionsData from '../../public/perguntas_dpc_33.json';

export const syncQuestions = async () => {
  try {
    console.log("Iniciando sincronização de perguntas...");
    
    // Para cada pergunta no JSON
    for (const question of questionsData) {
      // 1. Inserir a pergunta
      const { data: perguntaData, error: perguntaError } = await supabase
        .from('perguntas')
        .upsert({ 
          id: question.id,
          texto: question.texto 
        }, { onConflict: 'id' })
        .select();
      
      if (perguntaError) {
        console.error(`Erro ao inserir pergunta ${question.id}:`, perguntaError);
        continue;
      }
      
      console.log(`Pergunta ${question.id} sincronizada com sucesso`);
      
      // 2. Inserir as alternativas da pergunta
      for (const option of question.opcoes) {
        const { error: alternativaError } = await supabase
          .from('alternativas')
          .upsert({ 
            id: option.id,
            pergunta_id: question.id,
            texto: option.texto,
            perfis: option.perfis
          }, { onConflict: 'id' })
          .select();
        
        if (alternativaError) {
          console.error(`Erro ao inserir alternativa ${option.id}:`, alternativaError);
        } else {
          console.log(`Alternativa ${option.id} sincronizada com sucesso`);
        }
      }
    }
    
    console.log("Sincronização concluída com sucesso!");
    return { success: true, message: "Perguntas sincronizadas com sucesso!" };
  } catch (error) {
    console.error("Erro durante a sincronização:", error);
    return { success: false, message: "Erro ao sincronizar perguntas." };
  }
};
