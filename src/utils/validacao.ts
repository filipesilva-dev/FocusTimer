import type { DadosCard, DadosColecao, Dificuldade } from '../types/cards';

export function validarId(id: number): void {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error('O identificador deve ser um número inteiro positivo.');
  }
}

export function validarColecao(dados: DadosColecao): {
  nome: string;
  descricao: string | null;
} {
  if (!dados || typeof dados.nome !== 'string') {
    throw new Error('Informe o nome da coleção.');
  }

  const nome = dados.nome.trim();
  if (Array.from(nome).length < 1 || Array.from(nome).length > 60) {
    throw new Error('O nome deve ter entre 1 e 60 caracteres.');
  }

  if (dados.descricao != null && typeof dados.descricao !== 'string') {
    throw new Error('A descrição deve ser um texto.');
  }

  const descricao = dados.descricao?.trim() || null;
  if (descricao !== null && Array.from(descricao).length > 200) {
    throw new Error('A descrição deve ter até 200 caracteres.');
  }

  return { nome, descricao };
}

export function validarCard(dados: DadosCard): {
  pergunta: string;
  resposta: string;
  dificuldade: Dificuldade;
} {
  if (!dados || typeof dados.pergunta !== 'string' || typeof dados.resposta !== 'string') {
    throw new Error('Informe a pergunta e a resposta do flashcard.');
  }
  const pergunta = dados.pergunta.trim();
  const resposta = dados.resposta.trim();
  if (Array.from(pergunta).length < 1 || Array.from(pergunta).length > 500) {
    throw new Error('A pergunta deve ter entre 1 e 500 caracteres.');
  }
  if (Array.from(resposta).length < 1 || Array.from(resposta).length > 500) {
    throw new Error('A resposta deve ter entre 1 e 500 caracteres.');
  }
  const dificuldade = dados.dificuldade === undefined ? 'medio' : dados.dificuldade;
  if (dificuldade !== 'facil' && dificuldade !== 'medio' && dificuldade !== 'dificil') {
    throw new Error('Escolha uma dificuldade válida.');
  }
  return { pergunta, resposta, dificuldade };
}
