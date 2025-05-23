
import { supabase } from "@/integrations/supabase/client";
import { Answer, DiagnosticResult, Profile, Question } from "@/types/diagnostic";

export const submitDiagnostic = async (answers: Answer[]): Promise<DiagnosticResult> => {
  try {
    // Count scores for each profile
    const profileScores: Record<string, number> = {};
    
    answers.forEach(answer => {
      answer.perfis.forEach(profile => {
        if (!profileScores[profile]) {
          profileScores[profile] = 0;
        }
        profileScores[profile] += 1;
      });
    });
    
    // Find the dominant profile
    let maxScore = 0;
    let dominantProfile = "";
    
    Object.entries(profileScores).forEach(([profile, score]) => {
      if (score > maxScore) {
        maxScore = score;
        dominantProfile = profile;
      }
    });
    
    // Get profile data from Supabase
    const { data: profileData, error } = await supabase
      .from('perfis')
      .select('*')
      .eq('slug', dominantProfile)
      .single();
    
    if (error) {
      console.error('❌ Erro ao buscar perfil dominante:', error);
      throw error;
    }
    
    // Save responses to Supabase if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const responsesToSave = answers.map(answer => ({
        user_id: user.id,
        pergunta_id: answer.perguntaId,
        resposta: answer.resposta,
        perfis: answer.perfis
      }));
      
      const { error: saveError } = await supabase
        .from('respostas')
        .insert(responsesToSave);
        
      if (saveError) {
        console.error('❌ Erro ao salvar respostas:', saveError);
      } else {
        console.log('✅ Respostas salvas com sucesso');
      }
    }
    
    return {
      resultado: dominantProfile,
      pontuacoes: profileScores,
      perfil: profileData as Profile
    };
    
  } catch (error) {
    console.error('💥 Erro no envio do diagnóstico:', error);
    throw error;
  }
};

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
    
    const { data: perfisCount, error: perfisCountError } = await supabase
      .from('perfis')
      .select('*', { count: 'exact', head: true });
    
    console.log('📊 Verificação inicial de dados:', { 
      perguntasCount: perguntasCount !== null,
      alternativasCount: alternativasCount !== null,
      perfisCount: perfisCount !== null,
      errors: {
        perguntas: perguntasCountError?.message || null,
        alternativas: alternativasCountError?.message || null,
        perfis: perfisCountError?.message || null
      }
    });
    
    // Se alguma tabela está vazia, usar JSON local
    if (perguntasCountError || alternativasCountError || perfisCountError) {
      console.warn('⚠️ Erro ao verificar tabelas, usando JSON local');
      return await loadLocalQuestions();
    }
    
    // Buscar perguntas
    const { data: perguntasData, error: perguntasError } = await supabase
      .from('perguntas')
      .select('*')
      .order('id');
    
    console.log('📊 Resultado busca perguntas:', { 
      count: perguntasData?.length || 0,
      error: perguntasError?.message || null
    });
    
    if (perguntasError || !perguntasData || perguntasData.length === 0) {
      console.warn('⚠️ Nenhuma pergunta encontrada no Supabase ou erro, usando JSON local');
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
      console.warn('⚠️ Nenhuma alternativa encontrada no Supabase ou erro, usando JSON local');
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

const loadLocalQuestions = async (): Promise<Question[]> => {
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
