
import { supabase } from "@/integrations/supabase/client";
import { Question } from "@/types/diagnostic";
import { syncQuestions } from "@/scripts/syncQuestions";
import { loadLocalQuestions } from "./loadLocalQuestions";

export const fetchQuestions = async (): Promise<Question[]> => {
  try {
    console.log('🔍 Iniciando busca de perguntas...');
    
    // Verificar se as tabelas têm dados
    const { data: perguntasCount, error: perguntasCountError } = await supabase
      .from('perguntas')
      .select('*', { count: 'exact', head: true });
    
    const { data: alternativasCount, error: alternativasCountError } = await supabase
      .from('alternativas')
      .select('*', { count: 'exact', head: true });
    
    console.log('📊 Verificação inicial de dados:', { 
      perguntasCount: perguntasCount !== null,
      alternativasCount: alternativasCount !== null,
      errors: {
        perguntas: perguntasCountError?.message || null,
        alternativas: alternativasCountError?.message || null
      }
    });
    
    // Se alguma tabela está vazia ou com erro, sincronizar automaticamente
    if (perguntasCountError || alternativasCountError || perguntasCount === null || alternativasCount === null) {
      console.warn('⚠️ Dados não encontrados no Supabase, iniciando sincronização automática...');
      
      try {
        const syncResult = await syncQuestions();
        console.log('✅ Sincronização automática concluída:', syncResult);
      } catch (syncError) {
        console.error('💥 Erro na sincronização automática:', syncError);
        // Se a sincronização falhar, usar JSON local
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
      console.warn('⚠️ Nenhuma pergunta encontrada no Supabase após sincronização, usando JSON local');
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
      console.warn('⚠️ Nenhuma alternativa encontrada no Supabase após sincronização, usando JSON local');
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
