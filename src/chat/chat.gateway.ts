import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { MessageRegister } from '../message/message.type';
import { MessageService } from '../message/message.service';
import ConversationRegister from '../conversation/conversation.type';
import { ConversationService } from '../conversation/conversation.service';

@WebSocketGateway({ cors: { origin: process.env.APP_URL } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  private logger = new Logger('ChatGateway');

  constructor(
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
  ) {}

  @SubscribeMessage('chatCreateMessage')
  async handleCreateMessage(@MessageBody() {conversationId, userId, message}: MessageRegister) {
    this.logger.log(
      `Messages received: ${conversationId} - ${userId} - ${message}`,
    );

    const payload: MessageRegister = { 
      conversationId,
      userId,
      message
    };
    const createdMessage = await this.messageService.create(payload);
    const conversationMessages = await this.messageService.findAllByConversation({conversationId})
    
    this.server.emit('chatCreateMessage', conversationMessages);

    let conversation = await this.conversationService.findOne({id: conversationId});
    if(!conversation) throw Error('Invalid conversationId provided');

    conversation = {
      ...conversation,
      messages: [...conversation.messages, createdMessage.id],
    }
    await this.conversationService.update(conversation)
  }

  @SubscribeMessage('chatCreateConversation')
  async handleCreateConversation(@MessageBody() {name, participants}: ConversationRegister) {
    this.logger.log(
      `Conversations created: ${name} - ${participants}`,
    );

    const payload: ConversationRegister = { 
      name,
      participants,
      messages: [],
    };
    this.logger.log(`Payload being passed: ${JSON.stringify(payload)}`);
    const createdConversation = await this.conversationService.create(payload);

    this.server.emit('chatCreateConversation', createdConversation);
  }

  @SubscribeMessage('chatLoadConversation')
  async handleLoadConversation(@MessageBody() {conversationId}: MessageRegister) {
    this.logger.log(
      `Conversations loaded: ${conversationId}`,
    );

    const conversationMessages = await this.messageService.findAllByConversation({conversationId});

    this.server.emit('chatLoadConversation', conversationMessages);
  }

  @SubscribeMessage('chatDeleteConversation')
  async handleDeleteConversation(@MessageBody() {conversationId}: {conversationId: number}) {
    this.logger.log(
      `Conversations deleted: ${conversationId}`,
    );

    const conversationMessages = await this.messageService.findAllByConversation(
      {conversationId}
    );

    Promise.all(conversationMessages.map((elem) => this.messageService.remove(
        {id: elem.id}
      )
    ));

    const toDeleteConversation = await this.conversationService.findOne({id: conversationId});

    await this.conversationService.remove(toDeleteConversation);

    this.server.emit('chatDeleteConversation', toDeleteConversation);
  }

  // it will be handled when a client connects to the server
  handleConnection(socket: Socket) {
    this.logger.log(`Socket connected: ${socket.id}`);
  }

  // it will be handled when a client disconnects from the server
  handleDisconnect(socket: Socket) {
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }
}
