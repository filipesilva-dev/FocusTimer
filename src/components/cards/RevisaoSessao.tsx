import { Pressable, ScrollView, Text, View } from 'react-native';
import type { EstadoRevisao } from '../../utils/revisao';
import { revisaoStyles as styles } from './revisaoStyles';

type Props = {
  estado: EstadoRevisao;
  onRevelar: (cardId: number) => void;
  onResponder: (cardId: number, acertou: boolean) => void;
};

export default function RevisaoSessao({ estado, onRevelar, onResponder }: Props) {
  const card = estado.fila[0];
  if (!card) return null;
  const concluidos = estado.cards.length - estado.fila.length;
  return (
    <ScrollView style={styles.container}
      contentContainerStyle={[styles.conteudo, styles.conteudoRevisao, styles.conteudoSessao]}>
      <Text style={[styles.titulo, styles.tituloRevisao]} accessibilityRole="header">Revisão dos flashcards</Text>
      <View style={styles.progressoRevisao} accessibilityLiveRegion="polite">
        <Text style={styles.progressoTexto}>
          Concluídos: <Text style={styles.progressoNumero}>{concluidos} de {estado.cards.length}</Text>
        </Text>
        <Text style={styles.progressoTexto}>
          Pendentes: <Text style={styles.progressoNumero}>{estado.fila.length}</Text>
        </Text>
      </View>
      <View style={styles.areaEstudo}>
        <View style={[styles.cartao, styles.cartaoEstudo]}>
          <View style={[styles.blocoEstudo, !estado.respostaVisivel && styles.perguntaSemResposta]}>
            <Text style={[styles.label, styles.labelEstudo]}>Pergunta</Text>
            <Text style={styles.pergunta}>{card.pergunta}</Text>
          </View>
          {estado.respostaVisivel ? (
            <View style={[styles.blocoEstudo, styles.divisaoEstudo]}>
              <Text style={[styles.label, styles.labelEstudo]}>Resposta</Text>
              <Text style={styles.resposta}>{card.resposta}</Text>
            </View>
          ) : null}
        </View>
      </View>
      <View style={styles.acoesSessao}>
        {estado.respostaVisivel ? (
          <>
            <Pressable onPress={() => onResponder(card.id, true)} accessibilityRole="button"
              style={[styles.botao, styles.acaoSessao]}>
              <Text style={[styles.textoBotao, styles.textoAcaoRevisao]}>Acertei</Text>
            </Pressable>
            <Pressable onPress={() => onResponder(card.id, false)} accessibilityRole="button"
              accessibilityLabel="Errei — repetir depois"
              style={[styles.botao, styles.opcao, styles.acaoSessao]}>
              <Text style={[styles.textoOpcao, styles.textoAcaoRevisao]}>Errei</Text>
            </Pressable>
          </>
        ) : (
          <Pressable onPress={() => onRevelar(card.id)} accessibilityRole="button"
            style={[styles.botao, styles.acaoSessao]}>
            <Text style={[styles.textoBotao, styles.textoAcaoRevisao]}>Mostrar resposta</Text>
          </Pressable>
        )}
      </View>
      {estado.respostaVisivel ? (
        <Text style={styles.dicaRevisao}>Ao marcar “Errei”, o flashcard volta ao final da fila.</Text>
      ) : null}
    </ScrollView>
  );
}
