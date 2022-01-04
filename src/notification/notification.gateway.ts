import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Notification } from './entities/notification.entity';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class NotificationGateway {
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('MessageGateway');

  private count = 0;

  public async handleDisconnect(client: any): Promise<void> {
    this.count -= 1;
    this.logger.log(`Disconnected: ${this.count} connections`);
  }

  public async handleConnection(client: any, ...args: any[]): Promise<void> {
    this.count += 1;
    this.logger.log(`Connected: ${this.count} connections`);
  }

  public async afterInit(server: any): Promise<void> {
    this.logger.log('MessageGateway Initialized');
  }

  @SubscribeMessage('send-notification')
  createNotification(
    @MessageBody() notification: Notification,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(client.id).emit('receive-notification', notification);
  }

  @SubscribeMessage('send-warning-notification')
  createWarninNotification(
    @MessageBody() notification: Notification,
    @ConnectedSocket() client: Socket,
  ) {
    this.server
      .to(client.id)
      .emit('receive-warning-notification', notification);
  }
}
