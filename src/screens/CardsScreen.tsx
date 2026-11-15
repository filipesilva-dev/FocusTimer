import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import ColecaoForm from '../components/cards/ColecaoForm';
import ColecaoItem from '../components/cards/ColecaoItem';
import { atualizarColecao, criarColecao, excluirColecao, listarColecoes } from '../database/cardsRepository';
import type { Colecao, DadosColecao } from '../types/cards';
import { colors } from '../theme/colors';

export default function CardsScreen() {
  const [colecoes, setColecoes] = useState<Colecao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [atualizacao, setAtualizacao] = useState(0);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [colecaoEditando, setColecaoEditando] = useState<Colecao | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const exclusaoEmAndamento = useRef(false);
  const montada = useRef(true);

  useEffect(() => {
    montada.current = true;
    return () => { montada.current = false; };
  }, []);

  useFocusEffect(useCallback(() => {
    let ativa = true;
    async function carregar() {
      setCarregando(true);
      setErro('');
      try {
        const dados = await listarColecoes();
        if (ativa) setColecoes(dados);
      } catch {
        if (ativa) setErro('Não foi possível carregar suas coleções.');
      } finally {
        if (ativa) setCarregando(false);
      }
    }
    void carregar();
    return () => { ativa = false; };
  }, [atualizacao]));

  function abrirFormulario(colecao: Colecao | null) {
    setColecaoEditando(colecao);
    setFormularioAberto(true);
  }

  async function salvar(dados: DadosColecao) {
    let atualizada = true;
    try {
      if (colecaoEditando) {
        atualizada = await atualizarColecao(colecaoEditando.id, dados);
      } else {
        await criarColecao(dados);
      }
    } catch {
      throw new Error('Não foi possível salvar a coleção. Seus campos foram mantidos para tentar novamente.');
    }
    if (!atualizada) throw new Error('Esta coleção não existe mais. Feche o formulário e atualize a lista.');
    if (montada.current) {
      setAtualizacao((valor) => valor + 1);
    }
  }

  async function remover(colecao: Colecao) {
    if (exclusaoEmAndamento.current || !montada.current) return;
    exclusaoEmAndamento.current = true;
    setExcluindo(true);
    try {
      const removida = await excluirColecao(colecao.id);
      if (montada.current) {
        setAtualizacao((valor) => valor + 1);
        if (!removida) Alert.alert('Coleção não encontrada', 'A lista será atualizada.');
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

  function confirmarExclusao(colecao: Colecao) {
    Alert.alert('Excluir coleção?', `Excluir “${colecao.nome}” também removerá todos os seus cards.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => { void remover(colecao); } },
    ]);
  }

  return (
    <View style={styles.container}>
      <Header subtitle="Cards" />
      <View style={styles.conteudo}>
        <Text style={styles.titulo} accessibilityRole="header">Minhas coleções</Text>
        <Text style={styles.subtitulo}>Organize seus cards por assunto.</Text>
        <Pressable onPress={() => abrirFormulario(null)} disabled={carregando || excluindo}
          accessibilityRole="button" accessibilityLabel="Criar nova coleção"
          accessibilityState={{ disabled: carregando || excluindo }}
          style={[styles.botao, (carregando || excluindo) && styles.desabilitado]}>
          <Text style={styles.textoBotao}>Nova coleção</Text>
        </Pressable>
        {carregando ? (
          <View style={styles.estado}>
            <ActivityIndicator size="large" color={colors.primaryDark} />
            <Text style={styles.mensagem}>Carregando coleções…</Text>
          </View>
        ) : erro ? (
          <View style={styles.estado}>
            <Text style={styles.mensagem} accessibilityRole="alert">{erro}</Text>
            <Pressable onPress={() => setAtualizacao((valor) => valor + 1)}
              accessibilityRole="button" style={styles.botao}>
              <Text style={styles.textoBotao}>Tentar novamente</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList data={colecoes} keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.lista}
            renderItem={({ item }) => (
              <ColecaoItem colecao={item} desabilitado={excluindo}
                onEditar={() => abrirFormulario(item)} onExcluir={() => confirmarExclusao(item)} />
            )}
            ListEmptyComponent={<Text style={styles.mensagem}>Nenhuma coleção ainda. Toque em “Nova coleção” para começar.</Text>} />
        )}
      </View>
      {formularioAberto && <ColecaoForm colecao={colecaoEditando}
        onCancelar={() => setFormularioAberto(false)} onSalvar={salvar} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primaryBg },
  conteudo: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  titulo: { fontSize: 24, fontWeight: '700', color: colors.text },
  subtitulo: { color: colors.textMuted, marginTop: 6, marginBottom: 16 },
  botao: { minHeight: 48, backgroundColor: colors.primaryDark, paddingHorizontal: 20,
    paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  textoBotao: { color: colors.white, fontWeight: '700' },
  lista: { paddingBottom: 24 },
  estado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  mensagem: { color: colors.textMuted, textAlign: 'center', lineHeight: 22, paddingVertical: 16 },
  desabilitado: { opacity: 0.5 },
});
