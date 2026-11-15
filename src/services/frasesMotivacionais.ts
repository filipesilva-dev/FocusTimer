const URL_API = 'https://rodrigoborges.dev/api/frases/random';

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

type RespostaAPI = { id: number; text: string; author: string };

export async function buscarFraseMotivacional(): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  try {
    const resposta = await fetch(URL_API, { signal: controller.signal, headers: { Accept: 'application/json' } });
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const dados: RespostaAPI = await resposta.json();
    if (!dados?.text) throw new Error('Formato inesperado');
    return dados.author ? `${dados.text}\n\n— ${dados.author}` : dados.text;
  } catch (e) {
    console.warn('[frases] API falhou, usando fallback local:', (e as Error).message);
    return FRASES_FALLBACK[Math.floor(Math.random() * FRASES_FALLBACK.length)];
  } finally {
    clearTimeout(timeoutId);
  }
}
