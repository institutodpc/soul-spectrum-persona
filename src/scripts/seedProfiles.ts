
import { supabase } from "@/integrations/supabase/client";

// Sample profiles for demonstration
const profiles = [
  {
    slug: "perfeccionista",
    nome: "O Perfeccionista",
    descricao: "Busca constante pela perfeição e excelência.",
    emocao_predominante: "Ansiedade e autocrítica",
    influencia: "Tende a adiar decisões por medo de cometer erros, busca sempre a opção perfeita.",
    destino: "Limitação de oportunidades por medo de falhar ou ser julgado(a).",
    licao_espiritual: "Aprender que o crescimento vem através dos erros e imperfeições.",
    demonio_associado: "Espírito de controle e rigidez",
    operacao: "Instiga pensamentos de que nada que você faz é bom o suficiente.",
    artimanha: "Faz você acreditar que só será aceito(a) quando for perfeito(a).",
    refugio: "Controle excessivo e padrões inalcançáveis.",
    personagem_biblico: "Marta (irmã de Maria e Lázaro)",
    exaltacao: "Jesus ensinou Marta sobre a importância de estar em sua presença antes de servir perfeitamente.",
    formacao: "Geralmente formado na infância através de pressões familiares por excelência ou críticas constantes.",
    dores: ["Ansiedade", "Estresse", "Sentimento de inadequação", "Exaustão emocional"]
  },
  {
    slug: "culpado",
    nome: "O Culpado",
    descricao: "Vive sob o peso constante da culpa e arrependimento.",
    emocao_predominante: "Culpa e vergonha",
    influencia: "Toma decisões baseadas em compensar erros passados ou evitar sentir mais culpa.",
    destino: "Ciclo de autocastigo e dificuldade em avançar devido ao peso dos erros passados.",
    licao_espiritual: "Experimentar o poder do perdão e da graça divina.",
    demonio_associado: "Espírito de acusação",
    operacao: "Mantém você preso ao passado através de lembranças constantes dos erros.",
    artimanha: "Convence você de que não merece perdão ou uma nova chance.",
    refugio: "Autopunição e isolamento.",
    personagem_biblico: "Pedro (após negar Jesus)",
    exaltacao: "Jesus restaurou Pedro publicamente após sua negação, confiando-lhe o cuidado de seu rebanho.",
    formacao: "Desenvolvido através de experiências de rejeição, punição severa ou falhas significativas.",
    dores: ["Vergonha crônica", "Baixa autoestima", "Dificuldade em aceitar perdão", "Autossabotagem"]
  },
  {
    slug: "ansioso",
    nome: "O Ansioso",
    descricao: "Vive em constante estado de preocupação com o futuro.",
    emocao_predominante: "Medo e insegurança",
    influencia: "Toma decisões baseadas no pior cenário possível, evitando riscos.",
    destino: "Vida limitada pelo medo, perdendo oportunidades de crescimento e bênçãos.",
    licao_espiritual: "Desenvolver confiança em Deus e viver no momento presente.",
    demonio_associado: "Espírito de medo",
    operacao: "Projeta cenários catastróficos constantemente em sua mente.",
    artimanha: "Faz você acreditar que preocupação é responsabilidade e cuidado.",
    refugio: "Planejamento excessivo e controle.",
    personagem_biblico: "Gideão",
    exaltacao: "Deus transformou Gideão de um homem medroso em um guerreiro valente.",
    formacao: "Geralmente formado por experiências de insegurança, traumas ou instabilidade na infância.",
    dores: ["Ataques de pânico", "Insônia", "Tensão física constante", "Fadiga mental"]
  }
];

export const seedProfiles = async () => {
  try {
    // Verificar se já existem permissões de RLS para a tabela perfis
    const { data: rlsPolicies, error: rlsError } = await supabase
      .rpc('get_policies')
      .eq('tablename', 'perfis')
      .select();
    
    if (rlsError) {
      console.warn("Não foi possível verificar políticas RLS. Continuando mesmo assim...");
    }
    
    // Se não há políticas RLS, criar uma que permita inserções anônimas
    if (!rlsPolicies || rlsPolicies.length === 0) {
      // Esta operação requer privilégios administrativos e pode falhar em ambiente de produção
      try {
        await supabase.rpc('create_anon_insert_policy_for_profiles');
      } catch (policyError) {
        console.warn("Não foi possível criar política RLS. Permissões administrativas podem ser necessárias.");
      }
    }
    
    // Tentar inserir os perfis
    for (const profile of profiles) {
      const { error } = await supabase.from('perfis').upsert(profile, {
        onConflict: 'slug'
      });
      
      if (error) {
        console.error(`Error seeding profile ${profile.slug}:`, error);
      } else {
        console.log(`Profile ${profile.slug} added or updated successfully`);
      }
    }
  } catch (error) {
    console.error("Erro ao popular perfis:", error);
  }
};

// For testing purposes, you can uncomment and run this function when needed
// seedProfiles();
