import { Test, TestingModule } from '@nestjs/testing';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { Conversation } from './conversation.entity';
import { HttpException } from '@nestjs/common';
import { UserService } from '../user/user.service';

const mockUserService = {
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockConversationService = {
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const testConversation = {
  id: 1,
  participants: [1,2],
  messages: [1],
  createdAt: new Date(),
  updatedAt: new Date(),
  deleteAt: null,
} as Conversation;

describe('ConversationController', () => {
  let controller: ConversationController;
  let service: ConversationService;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      controllers: [ConversationController],
      providers: [
        {
          provide: ConversationService,
          useValue: mockConversationService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: ConversationService,
          useValue: mockConversationService,
        },
      ],
    }).compile();

    service = testModule.get<ConversationService>(ConversationService);
    controller = testModule.get<ConversationController>(ConversationController);
  });

  describe('find', () => {
    it('should find a conversation', async () => {
      mockConversationService.findOne.mockResolvedValueOnce(testConversation);
      const result = await controller.find(testConversation);

      expect(mockConversationService.findOne).toHaveBeenCalled();
      expect(mockConversationService.findOne).toHaveBeenCalledWith(testConversation);
      expect(result).toEqual(testConversation);
    });

    it('should not find a conversation', async () => {
      try {
        await controller.find({} as Conversation);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.conversation).toBe(
          'conversationController.find invalid conversation object',
        );
      }
    });
  });

  describe('findAll', () => {
    it('should a list of all conversations', async () => {
      mockConversationService.findAll.mockResolvedValueOnce([testConversation]);
      const result = await controller.findAll();

      expect(mockConversationService.findAll).toHaveBeenCalled();
      expect(result).toEqual([testConversation]);
    });

    it('should be empty array', async () => {
      mockConversationService.findAll.mockResolvedValueOnce([]);
      const result = await controller.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('remove', () => {
    it('should remove a conversation', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(testConversation);
      await controller.remove(testConversation);
    });
  });
});
