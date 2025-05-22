
// API para obter cidades por estado
export const fetchCitiesByState = async (state: string): Promise<string[]> => {
  try {
    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`);
    
    if (!response.ok) {
      throw new Error('Falha ao buscar cidades');
    }
    
    const data = await response.json();
    return data.map((city: { nome: string }) => city.nome).sort();
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    return [];
  }
};
