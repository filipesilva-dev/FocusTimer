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
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.titulo} accessibilityRole="header">Revisão dos flashcards</Text>
      <Text style={styles.texto} accessibilityLiveRegion="polite">
        Concluídos: {concluidos} de {estado.cards.length} · Pendentes: {estado.fila.length}
      </Text>
      <View style={styles.cartao}>
        <Text style={styles.label}>Pergunta</Text>
        <Text style={styles.pergunta}>{card.pergunta}</Text>
      </View>
      {estado.respostaVisivel ? (
        <>
          <View style={styles.cartao}>
            <Text style={styles.label}>Resposta</Text>
            <Text style={styles.resposta}>{card.resposta}</Text>
          </View>
          <Pressable onPress={() => onResponder(card.id, true)} accessibilityRole="button" style={styles.botao}>
            <Text style={styles.textoBotao}>Acertei</Text>
          </Pressable>
          <Pressable onPress={() => onResponder(card.id, false)} accessibilityRole="button"
            style={[styles.botao, styles.opcao]}>
            <Text style={styles.textoOpcao}>Errei — repetir depois</Text>
          </Pressable>
        </>
      ) : (
        <Pressable onPress={() => onRevelar(card.id)} accessibilityRole="button" style={styles.botao}>
          <Text style={styles.textoBotao}>Mostrar resposta</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
