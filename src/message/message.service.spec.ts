import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { Messages } from './message.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { MessageRegister } from './message.type';

describe('MessageController', () => {
  let service: MessageService;

  const mockMessageRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn()
  };

  const testMessage: MessageRegister = {
    message: 'Hello',
    userId: 1,
    conversationId: 2,
  };

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: getRepositoryToken(Messages),
          useValue: mockMessageRepository,
        },
      ],
    }).compile();

    service = testModule.get<MessageService>(MessageService);
  });

  describe('findAll', () => {
    it('should return an array of messages', async () => {
      mockMessageRepository.find.mockResolvedValueOnce([testMessage]);

      const messages: Messages[] = await service.findAll();
      expect(messages).toEqual([testMessage]);
    });

    it('should return an empty array', async () => {
      mockMessageRepository.find.mockResolvedValueOnce([]);

      const result = await service.findAll();

      expect(result).toStrictEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single message', async () => {
      mockMessageRepository.findOneBy.mockResolvedValueOnce(testMessage);

      const serviceMessage = await service.findOne(testMessage);
      expect(serviceMessage).toStrictEqual(testMessage);
    });

    it('should be null', async () => {
      const result = await service.findOne({ id: -1 });
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a message', async () => {
      mockMessageRepository.findOneBy.mockResolvedValueOnce(testMessage);
      const removeSpy =
       mockMessageRepository.delete.mockResolvedValueOnce(undefined);

      await service.remove(testMessage);

      expect(removeSpy).toHaveBeenCalledTimes(1);
      expect(removeSpy).toHaveBeenCalledWith(testMessage);
    });

    it('should not delete a message', async () => {
     mockMessageRepository.delete.mockResolvedValueOnce(undefined);

      try {
        await service.remove({ id: -1 });

        fail('remove() should have thrown NotFoundException');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Messages not found');
      }
    });
  });

  describe('create', () => {
    it('should create a message', async () => {
      mockMessageRepository.create.mockResolvedValueOnce(testMessage);
      const createSpy =
        mockMessageRepository.save.mockResolvedValueOnce(undefined);

      await service.create(testMessage);

      expect(createSpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalledWith(testMessage);
    });
  });
});
