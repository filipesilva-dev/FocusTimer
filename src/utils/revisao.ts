import type { Card, Dificuldade } from '../types/cards';

export type NivelRevisao = 'todos' | Dificuldade;
export type OrdemRevisao = 'sequencial' | 'aleatoria';

export interface EstadoRevisao {
  cards: Card[];
  fila: Card[];
  respostaVisivel: boolean;
  tentativas: number;
  acertosPrimeira: number;
  errosIds: number[];
  encerrada: boolean;
}

export function filtrarCards(cards: Card[], nivel: NivelRevisao): Card[] {
  return cards.filter((card) => nivel === 'todos' || card.dificuldade === nivel);
}

export function embaralharCards(cards: Card[], aleatorio: () => number = Math.random): Card[] {
  const resultado = [...cards];
  for (let i = resultado.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
  }
  return resultado;
}

export function iniciarRevisao(
  cards: Card[], nivel: NivelRevisao, ordem: OrdemRevisao, aleatorio: () => number = Math.random,
): EstadoRevisao {
  const selecionados = filtrarCards(cards, nivel)
    .map((card) => ({ ...card }))
    .sort((a, b) => a.criadoEm.localeCompare(b.criadoEm) || a.id - b.id);
  if (selecionados.length === 0) {
    throw new Error('Nenhum flashcard corresponde à dificuldade escolhida.');
  }
  return {
    cards: selecionados,
    fila: ordem === 'aleatoria' ? embaralharCards(selecionados, aleatorio) : [...selecionados],
    respostaVisivel: false,
    tentativas: 0,
    acertosPrimeira: 0,
    errosIds: [],
    encerrada: false,
  };
}

export function revelarResposta(estado: EstadoRevisao, cardId: number): EstadoRevisao {
  if (estado.encerrada || estado.fila[0]?.id !== cardId) return estado;
  return { ...estado, respostaVisivel: true };
}

export function responderCard(estado: EstadoRevisao, cardId: number, acertou: boolean): EstadoRevisao {
  const card = estado.fila[0];
  if (estado.encerrada || !estado.respostaVisivel || !card || card.id !== cardId) return estado;
  const jaErrou = estado.errosIds.includes(card.id);
  const restante = estado.fila.slice(1);
  const fila = acertou ? restante : [...restante, card];
  return {
    ...estado,
    fila,
    respostaVisivel: false,
    tentativas: estado.tentativas + 1,
    acertosPrimeira: estado.acertosPrimeira + (acertou && !jaErrou ? 1 : 0),
    errosIds: !acertou && !jaErrou ? [...estado.errosIds, card.id] : estado.errosIds,
    encerrada: fila.length === 0,
  };
}

export function encerrarRevisao(estado: EstadoRevisao): EstadoRevisao {
  return { ...estado, encerrada: true, respostaVisivel: false };
}

export function resumirRevisao(estado: EstadoRevisao) {
  return {
    total: estado.cards.length,
    concluidos: estado.cards.length - estado.fila.length,
    pendentes: estado.fila.length,
    tentativas: estado.tentativas,
    acertosPrimeira: estado.acertosPrimeira,
    cardsComErro: estado.cards.filter((card) => estado.errosIds.includes(card.id)),
  };
}
