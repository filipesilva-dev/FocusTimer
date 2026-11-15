import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { atualizarCard, criarCard, excluirCard, listarCards, obterColecao } from '../../database/cardsRepository';
import type { Card, Colecao, DadosCard } from '../../types/cards';
import { colors } from '../../theme/colors';
import CardForm from './CardForm';
import CardItem from './CardItem';
import Revisao from './Revisao';

type Props = { colecaoId: number; onFechar: () => void };

export default function ColecaoCards({ colecaoId, onFechar }: Props) {
  const [colecao, setColecao] = useState<Colecao | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [atualizacao, setAtualizacao] = useState(0);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [cardEditando, setCardEditando] = useState<Card | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [revisaoAberta, setRevisaoAberta] = useState(false);
  const voltarRevisao = useRef<(() => void) | null>(null);
  const exclusaoEmAndamento = useRef(false);
  const salvando = useRef(false);
  const montada = useRef(true);

  useEffect(() => {
    montada.current = true;
    return () => { montada.current = false; };
  }, []);

  useEffect(() => {
    let ativa = true;
    async function carregar() {
      setCarregando(true);
      setErro('');
      try {
        const [dadosColecao, dadosCards] = await Promise.all([obterColecao(colecaoId), listarCards(colecaoId)]);
        if (!ativa) return;
        setColecao(dadosColecao);
        setCards(dadosCards);
        if (!dadosColecao) setErro('Esta coleção não existe mais. Volte para atualizar a lista.');
      } catch {
        if (ativa) {
          setColecao(null);
          setErro('Não foi possível carregar os flashcards.');
        }
      } finally {
        if (ativa) setCarregando(false);
      }
    }
    void carregar();
    return () => { ativa = false; };
  }, [colecaoId, atualizacao]);

  function fechar() {
    if (salvando.current || exclusaoEmAndamento.current) return;
    if (revisaoAberta) {
      voltarRevisao.current?.();
      return;
    }
    if (formularioAberto) setFormularioAberto(false);
    else onFechar();
  }

  function abrirFormulario(card: Card | null) {
    setCardEditando(card);
    setFormularioAberto(true);
  }

  async function salvar(dados: DadosCard) {
    let atualizado = true;
    try {
      if (cardEditando) atualizado = await atualizarCard(colecaoId, cardEditando.id, dados);
      else await criarCard(colecaoId, dados);
    } catch {
      throw new Error('Não foi possível salvar o flashcard. Confira a coleção e tente novamente.');
    }
    if (!atualizado) throw new Error('Este flashcard não existe mais. Cancele a edição e atualize a lista.');
    if (montada.current) setAtualizacao((valor) => valor + 1);
  }

  async function remover(card: Card) {
    if (exclusaoEmAndamento.current || !montada.current) return;
    exclusaoEmAndamento.current = true;
    setExcluindo(true);
    try {
      const removido = await excluirCard(colecaoId, card.id);
      if (montada.current) {
        setAtualizacao((valor) => valor + 1);
        if (!removido) Alert.alert('Flashcard não encontrado', 'A lista será atualizada.');
      }
    } catch {
      if (montada.current) {
        setAtualizacao((valor) => valor + 1);
        Alert.alert('Não foi possível confirmar a exclusão', 'A lista será atualizada. Confira e tente novamente.');
      }
    } finally {
      exclusaoEmAndamento.current = false;
      if (montada.current) setExcluindo(false);
    }
  }

  function confirmarExclusao(card: Card) {
    Alert.alert('Excluir flashcard?', 'Deseja excluir este flashcard da coleção?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => { void remover(card); } },
    ]);
  }

  return (
    <Modal visible animationType="slide" onRequestClose={fechar}>
      <SafeAreaView style={styles.safeArea}>
        {revisaoAberta ? (
          <Revisao cards={cards} controleVoltar={voltarRevisao} onVoltar={() => setRevisaoAberta(false)} />
        ) : formularioAberto ? (
          <CardForm card={cardEditando} onSalvar={salvar} onCancelar={fechar}
            onOcupado={(valor) => { salvando.current = valor; }} />
        ) : (
          <View style={styles.container}>
            <Pressable onPress={fechar} disabled={excluindo} accessibilityRole="button"
              accessibilityLabel="Voltar às coleções" accessibilityState={{ disabled: excluindo }}
              style={[styles.voltar, excluindo && styles.desabilitado]}>
              <Text style={styles.textoVoltar}>‹ Voltar às coleções</Text>
            </Pressable>
            <Text style={styles.titulo} accessibilityRole="header">{colecao?.nome ?? 'Flashcards'}</Text>
            <Text style={styles.contagem}>{cards.length} {cards.length === 1 ? 'flashcard' : 'flashcards'}</Text>
            <Pressable onPress={() => abrirFormulario(null)} disabled={carregando || excluindo || !colecao}
              accessibilityRole="button" accessibilityLabel="Adicionar flashcard"
              accessibilityState={{ disabled: carregando || excluindo || !colecao }}
              style={[styles.botao, (carregando || excluindo || !colecao) && styles.desabilitado]}>
              <Text style={styles.textoBotao}>Adicionar flashcard</Text>
            </Pressable>
            <Pressable onPress={() => setRevisaoAberta(true)}
              disabled={carregando || excluindo || !!erro || cards.length === 0 || !colecao}
              accessibilityRole="button" accessibilityLabel="Revisar flashcards desta coleção"
              accessibilityState={{ disabled: carregando || excluindo || !!erro || cards.length === 0 || !colecao }}
              style={[styles.botao, styles.revisar,
                (carregando || excluindo || !!erro || cards.length === 0 || !colecao) && styles.desabilitado]}>
              <Text style={styles.textoVoltar}>Revisar flashcards</Text>
            </Pressable>
            {carregando ? (
              <View style={styles.estado}>
                <ActivityIndicator size="large" color={colors.primaryDark} />
                <Text style={styles.mensagem}>Carregando flashcards…</Text>
              </View>
            ) : erro ? (
              <View style={styles.estado}>
                <Text style={styles.mensagem} accessibilityRole="alert">{erro}</Text>
                <Pressable onPress={() => setAtualizacao((valor) => valor + 1)} accessibilityRole="button" style={styles.botao}>
                  <Text style={styles.textoBotao}>Tentar novamente</Text>
                </Pressable>
              </View>
            ) : (
              <FlatList data={cards} keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.lista} renderItem={({ item }) => (
                  <CardItem card={item} desabilitado={excluindo} onEditar={() => abrirFormulario(item)}
                    onExcluir={() => confirmarExclusao(item)} />
                )}
                ListEmptyComponent={<Text style={styles.mensagem}>Esta coleção ainda não tem flashcards. Adicione o primeiro para começar.</Text>} />
            )}
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primaryDark },
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: colors.primaryBg },
  voltar: { minHeight: 48, justifyContent: 'center', paddingVertical: 12, alignSelf: 'flex-start' },
  textoVoltar: { color: colors.primaryDarker, fontWeight: '600' },
  titulo: { fontSize: 24, fontWeight: '700', color: colors.text, marginTop: 8 },
  contagem: { color: colors.textMuted, marginTop: 8, marginBottom: 16 },
  botao: { minHeight: 48, padding: 14, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primaryDark, borderRadius: 12, marginBottom: 16 },
  textoBotao: { color: colors.white, fontWeight: '700' },
  revisar: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  estado: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  mensagem: { textAlign: 'center', color: colors.textMuted, lineHeight: 22, paddingVertical: 16 },
  lista: { paddingBottom: 24 },
  desabilitado: { opacity: 0.5 },
});
