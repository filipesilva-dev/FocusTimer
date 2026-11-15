import { Pressable, ScrollView, Text, View } from 'react-native';
import type { Card } from '../../types/cards';
import { filtrarCards, type NivelRevisao, type OrdemRevisao } from '../../utils/revisao';
import { revisaoStyles as styles } from './revisaoStyles';

type Props = {
  cards: Card[];
  nivel: NivelRevisao;
  ordem: OrdemRevisao;
  erro: string;
  onNivel: (nivel: NivelRevisao) => void;
  onOrdem: (ordem: OrdemRevisao) => void;
  onIniciar: () => void;
};

const NIVEIS: { valor: NivelRevisao; texto: string }[] = [
  { valor: 'todos', texto: 'Todos' }, { valor: 'facil', texto: 'Fácil' },
  { valor: 'medio', texto: 'Médio' }, { valor: 'dificil', texto: 'Difícil' },
];
const ORDENS: { valor: OrdemRevisao; texto: string }[] = [
  { valor: 'sequencial', texto: 'Sequencial' }, { valor: 'aleatoria', texto: 'Aleatória' },
];

export default function RevisaoConfig({ cards, nivel, ordem, erro, onNivel, onOrdem, onIniciar }: Props) {
  const quantidade = filtrarCards(cards, nivel).length;
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.titulo} accessibilityRole="header">Configurar revisão</Text>
      <Text style={styles.label}>Ordem dos flashcards</Text>
      <View style={styles.grupo}>
        {ORDENS.map((opcao) => (
          <Pressable key={opcao.valor} onPress={() => onOrdem(opcao.valor)} accessibilityRole="button"
            accessibilityLabel={`Ordem ${opcao.texto}`} accessibilityState={{ selected: ordem === opcao.valor }}
            style={[styles.botao, styles.opcao, ordem === opcao.valor && styles.selecionada]}>
            <Text style={ordem === opcao.valor ? styles.textoBotao : styles.textoOpcao}>
              {opcao.texto}{ordem === opcao.valor ? ' ✓' : ''}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.label}>Dificuldade</Text>
      <View style={styles.grupo}>
        {NIVEIS.map((opcao) => (
          <Pressable key={opcao.valor} onPress={() => onNivel(opcao.valor)} accessibilityRole="button"
            accessibilityLabel={`Dificuldade ${opcao.texto}`} accessibilityState={{ selected: nivel === opcao.valor }}
            style={[styles.botao, styles.opcao, nivel === opcao.valor && styles.selecionada]}>
            <Text style={nivel === opcao.valor ? styles.textoBotao : styles.textoOpcao}>
              {opcao.texto}{nivel === opcao.valor ? ' ✓' : ''}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.texto}>{quantidade} {quantidade === 1 ? 'flashcard selecionado' : 'flashcards selecionados'}</Text>
      {quantidade === 0 ? <Text style={styles.erro}>Não há flashcards nesta dificuldade. Escolha outra opção.</Text> : null}
      {erro ? <Text style={styles.erro} accessibilityRole="alert">{erro}</Text> : null}
      <Pressable onPress={onIniciar} disabled={quantidade === 0} accessibilityRole="button"
        accessibilityState={{ disabled: quantidade === 0 }}
        style={[styles.botao, quantidade === 0 && styles.desabilitado]}>
        <Text style={styles.textoBotao}>Iniciar revisão</Text>
      </Pressable>
    </ScrollView>
  );
}
