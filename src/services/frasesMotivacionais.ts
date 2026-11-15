const FRASES_FALLBACK = [
  'Cada pequeno passo é progresso. Continue!',
  'A constância vence o talento.',
  'Grandes conquistas começam com pequenas ações.',
  'Você está mais perto do que estava ontem.',
  'O esforço de hoje é o resultado de amanhã.',
  'Foco é a arte de dizer não ao que não importa agora.',
  'Não pare quando estiver cansado. Pare quando terminar.',
  'O segredo do sucesso é começar.',
  'Respire. Você está indo bem.',
  'Um passo de cada vez, sempre.',
];

export async function buscarFraseMotivacional(): Promise<string> {
  return FRASES_FALLBACK[Math.floor(Math.random() * FRASES_FALLBACK.length)];
}
