
import { supabase } from "@/integrations/supabase/client";
import { Question } from "@/types/diagnostic";
import { syncQuestions } from "@/scripts/syncQuestions";
import { loadLocalQuestions } from "./loadLocalQuestions";

// Função para verificar se precisa sincronizar
const shouldSync = async (): Promise<boolean> => {
  try {
    // Verificar se as tabelas têm dados
    const { count: perguntasCount, error: perguntasError } = await supabase
      .from('perguntas')
      .select('*', { count: 'exact', head: true });
    
    const { count: alternativasCount, error: alternativasError } = await supabase
      .from('alternativas')
      .select('*', { count: 'exact', head: true });
    
    // Se houver erro ou não houver dados, precisa sincronizar
    if (perguntasError || alternativasError || !perguntasCount || !alternativasCount) {
      return true;
    }
    
    // Verificar se temos o número esperado de perguntas (33)
    if (perguntasCount < 33) {
      console.log(`🔄 Sincronização necessária: apenas ${perguntasCount} perguntas encontradas, esperado 33`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('💥 Erro ao verificar necessidade de sincronização:', error);
    return true; // Em caso de erro, tenta sincronizar
  }
};

export const fetchQuestions = async (): Promise<Question[]> => {
  try {
    console.log('🔍 Iniciando busca de perguntas...');
    
    // Verificar se precisa sincronizar automaticamente
    const needsSync = await shouldSync();
    
    if (needsSync) {
      console.log('🔄 Iniciando sincronização automática...');
      try {
        const syncResult = await syncQuestions();
        if (syncResult.success) {
          console.log('✅ Sincronização automática concluída com sucesso!');
        } else {
          console.warn('⚠️ Sincronização falhou, usando JSON local:', syncResult.message);
          return await loadLocalQuestions();
        }
      } catch (syncError) {
        console.error('💥 Erro na sincronização automática:', syncError);
        return await loadLocalQuestions();
      }
    }
    
    // Buscar perguntas após possível sincronização
    const { data: perguntasData, error: perguntasError } = await supabase
      .from('perguntas')
      .select('*')
      .order('id');
    
    console.log('📊 Resultado busca perguntas:', { 
      count: perguntasData?.length || 0,
      error: perguntasError?.message || null
    });
    
    if (perguntasError || !perguntasData || perguntasData.length === 0) {
      console.warn('⚠️ Nenhuma pergunta encontrada no Supabase, usando JSON local');
      return await loadLocalQuestions();
    }
    
    // Buscar todas as alternativas
    const { data: alternativasData, error: alternativasError } = await supabase
      .from('alternativas')
      .select('*');
    
    console.log('📊 Resultado busca alternativas:', { 
      count: alternativasData?.length || 0,
      error: alternativasError?.message || null
    });
    
    if (alternativasError || !alternativasData || alternativasData.length === 0) {
      console.warn('⚠️ Nenhuma alternativa encontrada no Supabase, usando JSON local');
      return await loadLocalQuestions();
    }
    
    // Agrupar alternativas por pergunta_id
    const alternativasPorPergunta: Record<string, any[]> = {};
    alternativasData.forEach(alt => {
      if (!alternativasPorPergunta[alt.pergunta_id]) {
        alternativasPorPergunta[alt.pergunta_id] = [];
      }
      alternativasPorPergunta[alt.pergunta_id].push(alt);
    });
    
    // Montar as perguntas com suas alternativas
    const questions: Question[] = perguntasData.map(pergunta => ({
      id: pergunta.id,
      texto: pergunta.texto,
      opcoes: (alternativasPorPergunta[pergunta.id] || []).map(opcao => ({
        id: opcao.id,
        texto: opcao.texto,
        perfis: opcao.perfis || []
      }))
    }));
    
    // Filtrar perguntas que têm alternativas
    const questionsComAlternativas = questions.filter(q => q.opcoes.length > 0);
    
    console.log('✅ Perguntas processadas:', {
      totalPerguntas: questions.length,
      perguntasComAlternativas: questionsComAlternativas.length
    });
    
    if (questionsComAlternativas.length === 0) {
      console.warn('⚠️ Nenhuma pergunta com alternativas, usando JSON local');
      return await loadLocalQuestions();
    }
    
    return questionsComAlternativas;
    
  } catch (error) {
    console.error('💥 Erro geral ao buscar perguntas:', error);
    return await loadLocalQuestions();
  }
};
