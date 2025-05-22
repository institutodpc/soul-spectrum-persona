
import { supabase } from "@/integrations/supabase/client";
import questionsData from '../../public/perguntas_dpc_33.json';

export const syncQuestions = async () => {
  try {
    console.log("Iniciando sincronização de perguntas...");
    
    let stats = {
      perguntas: 0,
      alternativas: 0
    };
    
    // Transação para garantir consistência nos dados
    for (const question of questionsData) {
      // 1. Inserir a pergunta
      const { data: perguntaData, error: perguntaError } = await supabase
        .from('perguntas')
        .upsert({ 
          id: question.id,
          texto: question.texto 
        }, { 
          onConflict: 'id',
          ignoreDuplicates: false // atualizar se já existir
        })
        .select();
      
      if (perguntaError) {
        console.error(`Erro ao inserir pergunta ${question.id}:`, perguntaError);
        continue;
      }
      
      console.log(`Pergunta ${question.id} sincronizada com sucesso`);
      stats.perguntas++;
      
      // 2. Inserir as alternativas da pergunta
      const alternativasPromises = question.opcoes.map(option => {
        return supabase
          .from('alternativas')
          .upsert({ 
            id: option.id,
            pergunta_id: question.id,
            texto: option.texto,
            perfis: option.perfis
          }, { 
            onConflict: 'id',
            ignoreDuplicates: false // atualizar se já existir
          })
          .select();
      });
      
      // Executar todas as inserções de alternativas em paralelo
      const alternativasResults = await Promise.allSettled(alternativasPromises);
      
      // Contar alternativas sincronizadas com sucesso
      alternativasResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          if (!result.value.error) {
            stats.alternativas++;
            console.log(`Alternativa ${question.opcoes[index].id} sincronizada com sucesso`);
          } else {
            console.error(`Erro ao inserir alternativa ${question.opcoes[index].id}:`, result.value.error);
          }
        } else {
          console.error(`Falha na promessa para alternativa ${question.opcoes[index].id}:`, result.reason);
        }
      });
    }
    
    console.log(`Sincronização concluída com sucesso! ${stats.perguntas} perguntas e ${stats.alternativas} alternativas sincronizadas.`);
    return { 
      success: true, 
      message: `Sincronização concluída! ${stats.perguntas} perguntas e ${stats.alternativas} alternativas sincronizadas.`,
      stats 
    };
  } catch (error) {
    console.error("Erro durante a sincronização:", error);
    return { success: false, message: "Erro ao sincronizar perguntas." };
  }
};
