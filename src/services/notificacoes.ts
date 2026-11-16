import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false }),
});

export async function configurarNotificacoes(): Promise<boolean> {
  try {
    const { status: atual } = await Notifications.getPermissionsAsync();
    if (atual === 'granted') return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (e) { return false; }
}

export async function agendarFimDeFoco(segundos: number): Promise<string | null> {
  try {
    return await Notifications.scheduleNotificationAsync({
      content: { title: 'Foco concluído! 🎉', body: `Você estudou por ${Math.round(segundos / 60)} min. Hora da pausa!`, sound: true },
      trigger: { type: 'timeInterval', seconds: segundos },
    });
  } catch (e) { return null; }
}

export async function cancelarNotificacao(id: string | null): Promise<void> {
  if (!id) return;
  try { await Notifications.cancelScheduledNotificationAsync(id); } catch (e) {}
}
