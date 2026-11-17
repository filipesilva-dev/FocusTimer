import { Alert, Platform } from 'react-native';

type Confirmacao = {
  titulo: string;
  mensagem: string;
  onConfirmar: () => void;
  textoConfirmar?: string;
  textoCancelar?: string;
  destrutiva?: boolean;
};

export function mostrarAviso(titulo: string, mensagem: string): void {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n\n${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
}

export function confirmarAcao({
  titulo, mensagem, onConfirmar, textoConfirmar = 'Excluir',
  textoCancelar = 'Cancelar', destrutiva = true,
}: Confirmacao): void {
  if (Platform.OS === 'web') {
    if (window.confirm(`${titulo}\n\n${mensagem}`)) onConfirmar();
  } else {
    Alert.alert(titulo, mensagem, [
      { text: textoCancelar, style: 'cancel' },
      { text: textoConfirmar, style: destrutiva ? 'destructive' : 'default', onPress: onConfirmar },
    ]);
  }
}
