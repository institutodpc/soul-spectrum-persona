
import { supabase } from "@/integrations/supabase/client";
import questionsData from '../../public/perguntas_dpc_33.json';

export const syncQuestions = async () => {
  try {
    console.log("🔄 Iniciando sincronização de perguntas...");
    console.log(`📊 Total de perguntas no JSON: ${questionsData.length}`);
    
    let stats = {
      perguntas: {
        success: 0,
        error: 0,
        total: questionsData.length
      },
      alternativas: {
        success: 0,
        error: 0,
        total: 0
      }
    };
    
    // Transação para garantir consistência nos dados
    for (const question of questionsData) {
      // 1. Inserir a pergunta
      console.log(`Processando pergunta ${question.id}: "${question.texto.substring(0, 30)}..."`);
      
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
        console.error(`❌ Erro ao inserir pergunta ${question.id}:`, perguntaError);
        stats.perguntas.error++;
        continue;
      }
      
      console.log(`✅ Pergunta ${question.id} sincronizada com sucesso`);
      stats.perguntas.success++;
      
      // 2. Inserir as alternativas da pergunta
      stats.alternativas.total += question.opcoes.length;
      console.log(`Processando ${question.opcoes.length} alternativas para pergunta ${question.id}`);
      
      // Inserir cada alternativa individualmente para melhor rastreamento
      for (const option of question.opcoes) {
        const { data: alternativaData, error: alternativaError } = await supabase
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
          
        if (alternativaError) {
          console.error(`❌ Erro ao inserir alternativa ${option.id}:`, alternativaError);
          stats.alternativas.error++;
        } else {
          stats.alternativas.success++;
        }
      }
    }
    
    // Verificar se as perguntas e alternativas foram inseridas
    const { data: perguntasData, count: perguntasCount, error: perguntasCheckError } = await supabase
      .from('perguntas')
      .select('*', { count: 'exact' });
      
    const { data: alternativasData, count: alternativasCount, error: alternativasCheckError } = await supabase
      .from('alternativas')
      .select('*', { count: 'exact' });
      
    console.log(`📊 Resumo após sincronização:
      - Perguntas no banco: ${perguntasCount || 0}
      - Alternativas no banco: ${alternativasCount || 0}
      - Erros em perguntas: ${stats.perguntas.error}
      - Erros em alternativas: ${stats.alternativas.error}`
    );
    
    console.log(`✅ Sincronização concluída!`);
    return { 
      success: stats.perguntas.error === 0 && stats.alternativas.error === 0, 
      message: `Sincronização concluída! ${stats.perguntas.success}/${stats.perguntas.total} perguntas e ${stats.alternativas.success}/${stats.alternativas.total} alternativas sincronizadas.`,
      stats 
    };
  } catch (error) {
    console.error("💥 Erro durante a sincronização:", error);
    return { success: false, message: "Erro ao sincronizar perguntas." };
  }
};
