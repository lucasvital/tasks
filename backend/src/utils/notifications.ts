import { IUser } from "../models/User";

export const sendNotification = (user: IUser | undefined, message: string) => {
  if (user) {
    // Aqui você pode integrar com algum serviço de notificação ou apenas logar no console por enquanto
    console.log(`Notificação para ${user.username}: ${message}`);
  } else {
    console.log("Usuário não autenticado. Não é possível enviar notificação.");
  }
};
