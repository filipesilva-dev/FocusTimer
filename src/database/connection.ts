import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

const NOME_BANCO = 'focustimer.db';
let conexao: Promise<SQLiteDatabase> | null = null;

async function abrirBanco(): Promise<SQLiteDatabase> {
  const banco = await openDatabaseAsync(NOME_BANCO);
  try {
    await banco.execAsync(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS colecoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        criada_em TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        colecao_id INTEGER NOT NULL REFERENCES colecoes(id) ON DELETE CASCADE,
        pergunta TEXT NOT NULL,
        resposta TEXT NOT NULL,
        dificuldade TEXT NOT NULL DEFAULT 'medio',
        criado_em TEXT NOT NULL,
        atualizado_em TEXT NOT NULL
      );
    `);
    return banco;
  } catch (erro) {
    await banco.closeAsync().catch(() => undefined);
    throw erro;
  }
}

export function obterBanco(): Promise<SQLiteDatabase> {
  if (!conexao) {
    conexao = abrirBanco().catch((erro: unknown) => {
      // Uma falha temporária não deve impedir todas as próximas tentativas.
      conexao = null;
      throw erro;
    });
  }
  return conexao;
}
