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
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://stage.govo.fr",
      "https://www.stage.govo.fr",
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // On stocke les utilisateurs authentifiés : Map<SocketId, Username>
  private activeUsers = new Map<string, string>();

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    // Vérifier le token JWT si fourni et n'enregistrer que les utilisateurs authentifiés
    const token = client.handshake.query.token as string;
    let username: string | undefined = undefined;

    if (token) {
      try {
        const payload = this.jwtService.verify(token as string);
        username = (payload && (payload as any).username) ? String((payload as any).username) : undefined;
      } catch (e) {
        console.log(`⚠️ Jeton invalide pour la connexion ${client.id}`);
      }
    }

    // Si on a bien un username authentifié, on l'ajoute à la liste active
    if (username) {
      this.activeUsers.set(client.id, username);
      console.log(`✅ ${username} connecté (${client.id})`);
    } else {
      console.log(`ℹ️ Connexion anonyme (non authentifiée) ${client.id} — n'ajoute pas aux utilisateurs affichés`);
    }

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