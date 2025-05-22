
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
    console.log('Buscando perguntas do Supabase...');
    
    // Tentar obter as perguntas do Supabase com suas alternativas em uma única consulta
    const { data: perguntasData, error: perguntasError } = await supabase
      .from('perguntas')
      .select('*')
      .order('id');
    
    if (perguntasError || !perguntasData || perguntasData.length === 0) {
      console.log('Erro ou nenhuma pergunta encontrada no Supabase, usando JSON local:', perguntasError);
      // Fallback para o JSON local se não houver perguntas no Supabase
      const response = await fetch('/perguntas_dpc_33.json');
      if (!response.ok) {
        throw new Error('Failed to fetch questions from local JSON');
      }
      return await response.json();
    }
    
    // Agora vamos buscar todas as alternativas de uma vez para melhor performance
    const { data: todasAlternativas, error: alternativasError } = await supabase
      .from('alternativas')
      .select('*');
    
    if (alternativasError) {
      console.error('Erro ao buscar alternativas:', alternativasError);
      throw alternativasError;
    }
    
    // Agrupar alternativas por pergunta_id para acesso mais rápido
    const alternativasPorPergunta: Record<string, any[]> = {};
    todasAlternativas?.forEach(alt => {
      if (!alternativasPorPergunta[alt.pergunta_id]) {
        alternativasPorPergunta[alt.pergunta_id] = [];
      }
      alternativasPorPergunta[alt.pergunta_id].push(alt);
    });
    
    // Montar o resultado final combinando perguntas com suas alternativas
    const questions: Question[] = perguntasData.map(pergunta => {
      return {
        id: pergunta.id,
        texto: pergunta.texto,
        opcoes: (alternativasPorPergunta[pergunta.id] || []).map(opcao => ({
          id: opcao.id,
          texto: opcao.texto,
          perfis: opcao.perfis || []
        }))
      };
    });
    
    // Filtrar perguntas sem alternativas
    const questionsComAlternativas = questions.filter(q => q.opcoes.length > 0);
    
    if (questionsComAlternativas.length === 0) {
      console.log('Nenhuma pergunta com alternativas encontrada, usando JSON local');
      const response = await fetch('/perguntas_dpc_33.json');
      if (!response.ok) {
        throw new Error('Failed to fetch questions from local JSON');
      }
      return await response.json();
    }
    
    console.log(`Encontradas ${questionsComAlternativas.length} perguntas com alternativas no Supabase`);
    return questionsComAlternativas;
  } catch (error) {
    console.error('Erro ao buscar perguntas:', error);
    // Fallback para o JSON local em caso de erro
    const response = await fetch('/perguntas_dpc_33.json');
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    return await response.json();
  }
};
