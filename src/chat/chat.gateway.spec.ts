import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ConversationService } from '../conversation/conversation.service';
import { MessageService } from '../message/message.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Conversation } from '../conversation/conversation.entity';
import { Message } from '../message/message.entity';

describe('ChatGateway', () => {
  let gateway: ChatGateway;

  const mockMessageRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn()
  };

  const mockConversationRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        ConversationService,
        ChatGateway,
        {
          provide: getRepositoryToken(Message),
          useValue: mockMessageRepository,
        },
        {
          provide: getRepositoryToken(Conversation),
          useValue: mockConversationRepository
        }
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
