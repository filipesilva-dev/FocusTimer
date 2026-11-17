import type { Card, Colecao, DadosCard, DadosColecao } from '../types/cards';
import { validarCard, validarColecao, validarId } from '../utils/validacao';
import { obterBanco } from './connection';

const CONSULTA_COLECOES = `
  SELECT c.id, c.nome, c.descricao, c.criada_em AS criadaEm,
         COUNT(card.id) AS totalCards
  FROM colecoes c
  LEFT JOIN cards card ON card.colecao_id = c.id
`;

export async function listarColecoes(): Promise<Colecao[]> {
  const banco = await obterBanco();
  return banco.getAllAsync<Colecao>(`
    ${CONSULTA_COLECOES}
    GROUP BY c.id
    ORDER BY c.criada_em ASC, c.id ASC
  `);
}

export async function obterColecao(id: number): Promise<Colecao | null> {
  validarId(id);
  const banco = await obterBanco();
  return banco.getFirstAsync<Colecao>(
    `${CONSULTA_COLECOES} WHERE c.id = ? GROUP BY c.id`,
    [id],
  );
}

export async function criarColecao(dados: DadosColecao): Promise<number> {
  const { nome, descricao } = validarColecao(dados);
  const banco = await obterBanco();
  const resultado = await banco.runAsync(
    'INSERT INTO colecoes (nome, descricao, criada_em) VALUES (?, ?, ?)',
    [nome, descricao, new Date().toISOString()],
  );
  return resultado.lastInsertRowId;
}

export async function atualizarColecao(id: number, dados: DadosColecao): Promise<boolean> {
  validarId(id);
  const { nome, descricao } = validarColecao(dados);
  const banco = await obterBanco();
  const resultado = await banco.runAsync(
    'UPDATE colecoes SET nome = ?, descricao = ? WHERE id = ?',
    [nome, descricao, id],
  );
  return resultado.changes > 0;
}

export async function excluirColecao(id: number): Promise<boolean> {
  validarId(id);
  const banco = await obterBanco();
  const resultado = await banco.runAsync('DELETE FROM colecoes WHERE id = ?', [id]);
  return resultado.changes > 0;
}

const CONSULTA_CARDS = `
  SELECT id, colecao_id AS colecaoId, pergunta, resposta, dificuldade,
         criado_em AS criadoEm, atualizado_em AS atualizadoEm
  FROM cards
`;

export async function listarCards(colecaoId: number): Promise<Card[]> {
  validarId(colecaoId);
  const banco = await obterBanco();
  return banco.getAllAsync<Card>(
    `${CONSULTA_CARDS} WHERE colecao_id = ? ORDER BY criado_em ASC, id ASC`,
    [colecaoId],
  );
}

export async function criarCard(colecaoId: number, dados: DadosCard): Promise<number> {
  validarId(colecaoId);
  const { pergunta, resposta, dificuldade } = validarCard(dados);
  const banco = await obterBanco();
  const agora = new Date().toISOString();
  const resultado = await banco.runAsync(
    `INSERT INTO cards (colecao_id, pergunta, resposta, dificuldade, criado_em, atualizado_em)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [colecaoId, pergunta, resposta, dificuldade, agora, agora],
  );
  return resultado.lastInsertRowId;
}

export async function atualizarCard(colecaoId: number, id: number, dados: DadosCard): Promise<boolean> {
  validarId(colecaoId);
  validarId(id);
  const { pergunta, resposta, dificuldade } = validarCard(dados);
  const banco = await obterBanco();
  const resultado = await banco.runAsync(
    `UPDATE cards SET pergunta = ?, resposta = ?, dificuldade = ?, atualizado_em = ?
     WHERE id = ? AND colecao_id = ?`,
    [pergunta, resposta, dificuldade, new Date().toISOString(), id, colecaoId],
  );
  return resultado.changes > 0;
}

export async function excluirCard(colecaoId: number, id: number): Promise<boolean> {
  validarId(colecaoId);
  validarId(id);
  const banco = await obterBanco();
  const resultado = await banco.runAsync('DELETE FROM cards WHERE id = ? AND colecao_id = ?', [id, colecaoId]);
  return resultado.changes > 0;
}
