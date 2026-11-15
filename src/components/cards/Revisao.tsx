import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Card } from '../../types/cards';
import {
  encerrarRevisao, iniciarRevisao, responderCard, revelarResposta,
  type EstadoRevisao, type NivelRevisao, type OrdemRevisao,
} from '../../utils/revisao';
import RevisaoConfig from './RevisaoConfig';
import RevisaoResumo from './RevisaoResumo';
import RevisaoSessao from './RevisaoSessao';
import { revisaoStyles as styles } from './revisaoStyles';
import { colors } from '../../theme/colors';

type Props = {
  cards: Card[];
  onVoltar: () => void;
  controleVoltar: RefObject<(() => void) | null>;
};

export default function Revisao({ cards, onVoltar, controleVoltar }: Props) {
  const [nivel, setNivel] = useState<NivelRevisao>('todos');
  const [ordem, setOrdem] = useState<OrdemRevisao>('sequencial');
  const [erro, setErro] = useState('');
  const [estado, setEstado] = useState<EstadoRevisao | null>(null);
  const estadoAtual = useRef<EstadoRevisao | null>(null);

  const atualizar = useCallback((novo: EstadoRevisao) => {
    estadoAtual.current = novo;
    setEstado(novo);
  }, []);

  const voltar = useCallback(() => {
    const atual = estadoAtual.current;
    if (!atual || atual.encerrada) {
      onVoltar();
      return;
    }
    Alert.alert('Encerrar revisão?', 'Você verá o resumo com os flashcards que ainda ficaram pendentes.', [
      { text: 'Continuar revisando', style: 'cancel' },
      { text: 'Encerrar', onPress: () => {
        const sessao = estadoAtual.current;
        if (sessao && !sessao.encerrada) atualizar(encerrarRevisao(sessao));
      } },
    ]);
  }, [atualizar, onVoltar]);

  useEffect(() => {
    controleVoltar.current = voltar;
    return () => { controleVoltar.current = null; };
  }, [controleVoltar, voltar]);

  function iniciar() {
    if (estadoAtual.current && !estadoAtual.current.encerrada) return;
    try {
      atualizar(iniciarRevisao(cards, nivel, ordem));
      setErro('');
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível iniciar a revisão.');
    }
  }

  function revelar(cardId: number) {
    const atual = estadoAtual.current;
    if (atual) atualizar(revelarResposta(atual, cardId));
  }

  function responder(cardId: number, acertou: boolean) {
    const atual = estadoAtual.current;
    if (atual) atualizar(responderCard(atual, cardId, acertou));
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={voltar} accessibilityRole="button" style={locais.voltar}>
        <Text style={styles.textoOpcao}>
          {estado && !estado.encerrada ? 'Encerrar revisão' : '‹ Voltar aos flashcards'}
        </Text>
      </Pressable>
      {!estado ? (
        <RevisaoConfig cards={cards} nivel={nivel} ordem={ordem} erro={erro}
          onNivel={setNivel} onOrdem={setOrdem} onIniciar={iniciar} />
      ) : estado.encerrada ? (
        <RevisaoResumo estado={estado} onReiniciar={iniciar} onVoltar={onVoltar} />
      ) : (
        <RevisaoSessao estado={estado} onRevelar={revelar} onResponder={responder} />
      )}
    </View>
  );
}

const locais = StyleSheet.create({
  voltar: { minHeight: 48, paddingHorizontal: 20, paddingVertical: 12,
    alignItems: 'flex-start', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: colors.border },
});
