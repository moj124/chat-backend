import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { HttpException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConversationService } from '../conversation/conversation.service';

const mockMessageService = {
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

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

const testMessage = {
  id: 1,
  message: 'Hello',
  senderId: 1,
  receiverId: 2,
  lastName: 'last',
  createdAt: new Date(),
  updatedAt: new Date(),
  deleteAt: null,
} as Message;

describe('MessageController', () => {
  let controller: MessageController;
  let service: MessageService;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        {
          provide: MessageService,
          useValue: mockMessageService,
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

    service = testModule.get<MessageService>(MessageService);
    controller = testModule.get<MessageController>(MessageController);
  });

  describe('find', () => {
    it('should find a message', async () => {
      mockMessageService.findOne.mockResolvedValueOnce(testMessage);
      const result = await controller.find(testMessage);

      expect(mockMessageService.findOne).toHaveBeenCalled();
      expect(mockMessageService.findOne).toHaveBeenCalledWith(testMessage);
      expect(result).toEqual(testMessage);
    });

    it('should not find a message', async () => {
      try {
        await controller.find({} as Message);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe(
          'messageController.find invalid message object',
        );
      }
    });
  });

  describe('findAll', () => {
    it('should a list of all messages', async () => {
      mockMessageService.findAll.mockResolvedValueOnce([testMessage]);
      const result = await controller.findAll();

      expect(mockMessageService.findAll).toHaveBeenCalled();
      expect(result).toEqual([testMessage]);
    });

    it('should be empty array', async () => {
      mockMessageService.findAll.mockResolvedValueOnce([]);
      const result = await controller.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('send', () => {
    it('should send a message', async () => {
      mockMessageService.findOne.mockResolvedValueOnce(null);
      mockMessageService.create.mockResolvedValueOnce(testMessage);
      const result = await controller.send(testMessage);

      expect(result).toStrictEqual(testMessage);
    });
  });

  describe('remove', () => {
    it('should remove a message', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(testMessage);
      await controller.remove(testMessage);
    });
  });
});
