import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173', // Ton React
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  // Quand un client se connecte
  async handleConnection(client: Socket) {
    console.log(`✅ Client connecté : ${client.id}`);
    try {
      // Envoyer l'historique des messages au nouveau client
      const messages = await this.chatService.getAllMessages();
      client.emit('message_history', messages);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique:", error);
    }
  }

  // Quand un client se déconnecte
  handleDisconnect(client: Socket) {
    console.log(`❌ Client déconnecté : ${client.id}`);
  }

  // Recevoir un message du client
  @SubscribeMessage('msg_to_server')
  async handleMessage(
    @MessageBody() data: { user: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('📩 Message reçu du client:', data);

    // Sauvegarder dans MongoDB
    const savedMessage = await this.chatService.createMessage(
      data.user,
      data.text,
    );

    // Envoyer à TOUS les clients connectés (broadcast)
    this.server.emit('msg_to_client', {
      _id: savedMessage._id,
      user: savedMessage.user,
      text: savedMessage.text,
      createdAt: savedMessage.createdAt,
    });
  }
}