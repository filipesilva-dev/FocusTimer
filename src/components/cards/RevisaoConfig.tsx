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
    <ScrollView style={styles.container} contentContainerStyle={[styles.conteudo, styles.conteudoRevisao]}>
      <Text style={[styles.titulo, styles.tituloRevisao]} accessibilityRole="header">Configurar revisão</Text>
      <Text style={[styles.texto, styles.textoRevisao]}>Escolha a ordem e a dificuldade para começar.</Text>
      <View style={[styles.cartao, styles.blocoConfiguracao]}>
        <Text style={[styles.label, styles.labelConfiguracao]}>Ordem dos flashcards</Text>
        <View style={[styles.grupo, styles.grupoConfiguracao]}>
          {ORDENS.map((opcao) => (
            <Pressable key={opcao.valor} onPress={() => onOrdem(opcao.valor)} accessibilityRole="button"
              accessibilityLabel={`Ordem ${opcao.texto}`} accessibilityState={{ selected: ordem === opcao.valor }}
              style={[styles.botao, styles.opcao, styles.opcaoConfiguracao,
                ordem === opcao.valor && styles.selecionada]}>
              <Text style={[ordem === opcao.valor ? styles.textoBotao : styles.textoOpcao, styles.textoConfiguracao]}>
                {opcao.texto}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.divisaoConfiguracao}>
          <Text style={[styles.label, styles.labelConfiguracao]}>Dificuldade</Text>
          <View style={[styles.grupo, styles.grupoConfiguracao]}>
            {NIVEIS.map((opcao) => (
              <Pressable key={opcao.valor} onPress={() => onNivel(opcao.valor)} accessibilityRole="button"
                accessibilityLabel={`Dificuldade ${opcao.texto}`} accessibilityState={{ selected: nivel === opcao.valor }}
                style={[styles.botao, styles.opcao, styles.opcaoConfiguracao,
                  nivel === opcao.valor && styles.selecionada]}>
                <Text style={[nivel === opcao.valor ? styles.textoBotao : styles.textoOpcao, styles.textoConfiguracao]}>
                  {opcao.texto}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.rodapeConfiguracao}>
        <Text style={[styles.texto, styles.textoRevisao]}>
          {quantidade} {quantidade === 1 ? 'flashcard selecionado' : 'flashcards selecionados'}
        </Text>
        {quantidade === 0 ? <Text style={styles.erro}>Não há flashcards nesta dificuldade. Escolha outra opção.</Text> : null}
        {erro ? <Text style={styles.erro} accessibilityRole="alert">{erro}</Text> : null}
        <Pressable onPress={onIniciar} disabled={quantidade === 0} accessibilityRole="button"
          accessibilityState={{ disabled: quantidade === 0 }}
          style={[styles.botao, quantidade === 0 && styles.desabilitado]}>
          <Text style={[styles.textoBotao, styles.textoAcaoRevisao]}>Iniciar revisão</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
