
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
    
    if (error) throw error;
    
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
        console.error('Error saving responses:', saveError);
      }
    }
    
    return {
      resultado: dominantProfile,
      pontuacoes: profileScores,
      perfil: profileData as Profile
    };
    
  } catch (error) {
    console.error('Error in diagnostic submission:', error);
    throw error;
  }
};

export const fetchQuestions = async (): Promise<Question[]> => {
  try {
    console.log('🔍 Iniciando busca de perguntas...');
    
    // Primeiro, verificar se as tabelas existem
    const { data: perguntasData, error: perguntasError } = await supabase
      .from('perguntas')
      .select('*')
      .order('id');
    
    console.log('📊 Resultado busca perguntas:', { 
      perguntasData, 
      perguntasError,
      count: perguntasData?.length || 0 
    });
    
    if (perguntasError) {
      console.error('❌ Erro ao buscar perguntas:', perguntasError);
      return await loadLocalQuestions();
    }
    
    if (!perguntasData || perguntasData.length === 0) {
      console.warn('⚠️ Nenhuma pergunta encontrada no Supabase');
      return await loadLocalQuestions();
    }
    
    // Buscar todas as alternativas
    const { data: alternativasData, error: alternativasError } = await supabase
      .from('alternativas')
      .select('*');
    
    console.log('📊 Resultado busca alternativas:', { 
      alternativasData, 
      alternativasError,
      count: alternativasData?.length || 0 
    });
    
    if (alternativasError) {
      console.error('❌ Erro ao buscar alternativas:', alternativasError);
      return await loadLocalQuestions();
    }
    
    if (!alternativasData || alternativasData.length === 0) {
      console.warn('⚠️ Nenhuma alternativa encontrada no Supabase');
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
