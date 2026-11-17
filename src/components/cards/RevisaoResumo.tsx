import { FlatList, Pressable, Text, View } from 'react-native';
import { resumirRevisao, type EstadoRevisao } from '../../utils/revisao';
import { revisaoStyles as styles } from './revisaoStyles';

type Props = { estado: EstadoRevisao; onReiniciar: () => void; onVoltar: () => void };

export default function RevisaoResumo({ estado, onReiniciar, onVoltar }: Props) {
  const resumo = resumirRevisao(estado);
  return (
    <FlatList style={styles.container} contentContainerStyle={styles.conteudo}
      data={resumo.cardsComErro} keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={(
        <View>
          <Text style={styles.titulo} accessibilityRole="header">
            {resumo.pendentes > 0 ? 'Sessão encerrada' : 'Revisão concluída!'}
          </Text>
          <View style={styles.cartao}>
            <Text style={styles.texto}>Total de flashcards: {resumo.total}</Text>
            <Text style={styles.texto}>Concluídos: {resumo.concluidos}</Text>
            <Text style={styles.texto}>Pendentes: {resumo.pendentes}</Text>
            <Text style={styles.texto}>Acertos de primeira: {resumo.acertosPrimeira}</Text>
            <Text style={styles.texto}>Total de tentativas: {resumo.tentativas}</Text>
          </View>
          <Pressable onPress={onReiniciar} accessibilityRole="button" style={styles.botao}>
            <Text style={styles.textoBotao}>Revisar de novo</Text>
          </Pressable>
          <Pressable onPress={onVoltar} accessibilityRole="button" style={[styles.botao, styles.opcao]}>
            <Text style={styles.textoOpcao}>Voltar aos flashcards</Text>
          </Pressable>
          <Text style={styles.label}>Flashcards que tiveram erro: {resumo.cardsComErro.length}</Text>
        </View>
      )}
      renderItem={({ item }) => (
        <View style={styles.cartao}>
          <Text style={styles.label}>Pergunta</Text>
          <Text style={styles.texto}>{item.pergunta}</Text>
          <Text style={styles.label}>Resposta</Text>
          <Text style={styles.texto}>{item.resposta}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.texto}>Nenhum flashcard teve erro nesta sessão.</Text>} />
  );
}
