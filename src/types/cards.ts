export type Dificuldade = 'facil' | 'medio' | 'dificil';

export interface Colecao {
  id: number;
  nome: string;
  descricao: string | null;
  criadaEm: string;
  totalCards: number;
}

export interface Card {
  id: number;
  colecaoId: number;
  pergunta: string;
  resposta: string;
  dificuldade: Dificuldade;
  criadoEm: string;
  atualizadoEm: string;
}

export interface DadosColecao {
  nome: string;
  descricao?: string | null;
}

export interface DadosCard {
  pergunta: string;
  resposta: string;
  dificuldade?: Dificuldade;
}
