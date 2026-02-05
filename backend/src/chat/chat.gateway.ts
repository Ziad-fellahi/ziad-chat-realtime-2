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
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // On stocke les utilisateurs : Map<SocketId, Username>
  private activeUsers = new Map<string, string>();

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    // On récupère le nom depuis la query string (ex: ?username=Bot-1)
    const username = client.handshake.query.username as string || `Guest-${client.id.slice(0, 4)}`;
    
    this.activeUsers.set(client.id, username);
    console.log(`✅ ${username} connecté (${client.id})`);

    // 1. Envoyer l'historique au nouveau venu
    try {
      const messages = await this.chatService.getAllMessages();
      client.emit('message_history', messages);
    } catch (e) {
      console.error("Erreur historique:", e);
    }

    // 2. Diffuser la nouvelle liste des connectés à TOUT LE MONDE
    this.broadcastUserList();
  }

  handleDisconnect(client: Socket) {
    const username = this.activeUsers.get(client.id);
    this.activeUsers.delete(client.id);
    console.log(`❌ ${username} déconnecté`);

    // Mettre à jour la liste chez tout le monde
    this.broadcastUserList();
  }

  private broadcastUserList() {
    // On transforme la Map en tableau de noms uniques
    const users = Array.from(this.activeUsers.values());
    this.server.emit('update_user_list', users);
  }

  @SubscribeMessage('msg_to_server')
  async handleMessage(
    @MessageBody() data: { user: string; text: string },
  ) {
    // DIFFUSION IMMÉDIATE (Performance Max)
    const msgPayload = {
      user: data.user,
      text: data.text,
      createdAt: new Date(),
    };
    this.server.emit('msg_to_client', msgPayload);

    // Sauvegarde asynchrone (ne bloque pas le flux)
    this.chatService.createMessage(data.user, data.text).catch(console.error);
  }

  @SubscribeMessage('typing_start')
  handleTypingStart(@MessageBody() data: { user: string }, @ConnectedSocket() client: Socket) {
    client.broadcast.emit('typing_to_client', { user: data.user, isTyping: true });
  }

  @SubscribeMessage('typing_stop')
  handleTypingStop(@MessageBody() data: { user: string }, @ConnectedSocket() client: Socket) {
    client.broadcast.emit('typing_to_client', { user: data.user, isTyping: false });
  }
}