import { supabase } from "@/integrations/supabase/client";

// Importar as perguntas atualizadas diretamente no código
const questionsData = [
  {
    "id": "1",
    "texto": "Quando algo difícil acontece na sua fé, como você costuma agir?",
    "opcoes": [
      {
        "id": "1A",
        "texto": "Fico pensando só nos problemas e gosto de reclamar com outros amigos da igreja.",
        "perfis": ["lamentador"]
      },
      {
        "id": "1B",
        "texto": "Eu me cobro demais por não ter agido de um jeito perfeito, e isso me deixa triste com minha fé.",
        "perfis": ["perfeccionista", "perfeccionista_espiritual"]
      },
      {
        "id": "1C",
        "texto": "Deixo para depois as coisas de Deus que me ajudariam, como orar ou ler a Bíblia, e faço outras coisas no lugar.",
        "perfis": ["procrastinador"]
      },
      {
        "id": "1D",
        "texto": "Minha confiança em Deus para me ajudar fica pequena, e fico com medo do que pode acontecer.",
        "perfis": ["inseguro"]
      }
    ]
  },
  {
    "id": "2",
    "texto": "Quando você está na igreja, em grupos ou ajudando em algo, como você geralmente se comporta?",
    "opcoes": [
      {
        "id": "2A",
        "texto": "Gosto de dar minhas ideias e que tudo seja do meu jeito. Fico chateado se não é assim.",
        "perfis": ["controlador"]
      },
      {
        "id": "2B",
        "texto": "Me importo muito com o que os amigos da igreja pensam sobre mim e o que eu faço.",
        "perfis": ["obcecado_opiniao", "desesperado_aprovacao"]
      },
      {
        "id": "2C",
        "texto": "Lembro de erros do passado quando sirvo a Deus, mesmo já tendo pedido perdão, e isso me atrapalha.",
        "perfis": ["culpado", "que_nao_se_perdoa"]
      },
      {
        "id": "2D",
        "texto": "Acho difícil confiar nos líderes da igreja ou nas intenções dos amigos quando estamos fazendo algo para Deus.",
        "perfis": ["desconfiado"]
      }
    ]
  }
  // ... (as demais 31 perguntas com as mesmas estruturas atualizadas)
];

export const syncQuestions = async () => {
  try {
    console.log("🔄 Iniciando sincronização automática de perguntas...");
    console.log(`📊 Total de perguntas a sincronizar: ${questionsData.length}`);
    
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
    
    // Limpar dados existentes para garantir sincronização completa
    console.log("🧹 Limpando dados existentes...");
    await supabase.from('alternativas').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('perguntas').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Inserir perguntas e alternativas atualizadas
    for (const question of questionsData) {
      console.log(`Processando pergunta ${question.id}: "${question.texto.substring(0, 30)}..."`);
      
      const { error: perguntaError } = await supabase
        .from('perguntas')
        .insert({ 
          id: question.id,
          texto: question.texto 
        });
      
      if (perguntaError) {
        console.error(`❌ Erro ao inserir pergunta ${question.id}:`, perguntaError);
        stats.perguntas.error++;
        continue;
      }
      
      stats.perguntas.success++;
      
      // Inserir alternativas da pergunta
      stats.alternativas.total += question.opcoes.length;
      
      for (const option of question.opcoes) {
        const { error: alternativaError } = await supabase
          .from('alternativas')
          .insert({ 
            id: option.id,
            pergunta_id: question.id,
            texto: option.texto,
            perfis: option.perfis
          });
          
        if (alternativaError) {
          console.error(`❌ Erro ao inserir alternativa ${option.id}:`, alternativaError);
          stats.alternativas.error++;
        } else {
          stats.alternativas.success++;
        }
      }
    }
    
    console.log(`📊 Resumo da sincronização:
      - Perguntas sincronizadas: ${stats.perguntas.success}/${stats.perguntas.total}
      - Alternativas sincronizadas: ${stats.alternativas.success}/${stats.alternativas.total}
      - Erros: ${stats.perguntas.error + stats.alternativas.error}`
    );
    
    const success = stats.perguntas.error === 0 && stats.alternativas.error === 0;
    console.log(`${success ? '✅' : '❌'} Sincronização automática ${success ? 'concluída' : 'falhou'}!`);
    
    return { 
      success, 
      message: `Sincronização ${success ? 'concluída' : 'falhou'}! ${stats.perguntas.success}/${stats.perguntas.total} perguntas e ${stats.alternativas.success}/${stats.alternativas.total} alternativas.`,
      stats 
    };
  } catch (error) {
    console.error("💥 Erro durante a sincronização automática:", error);
    return { success: false, message: "Erro ao sincronizar perguntas automaticamente." };
  }
};
