import type { DadosColecao } from '../types/cards';

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
