"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const sendNotification = (user, message) => {
    if (user) {
        // Aqui você pode integrar com algum serviço de notificação ou apenas logar no console por enquanto
        console.log(`Notificação para ${user.username}: ${message}`);
    }
    else {
        console.log("Usuário não autenticado. Não é possível enviar notificação.");
    }
};
exports.sendNotification = sendNotification;
