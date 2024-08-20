import { Test, TestingModule } from '@nestjs/testing';
import { ConversationService } from './conversation.service';
import { Conversation } from './conversation.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import ConversationRegister from './conversation.type';

describe('ConversationController', () => {
  let service: ConversationService;

  const mockConversationRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn()
  };

  const testConversation: Conversation = {
    id:1,
    name: 'convo',
    participants: [1],
    messages: [1],
    createdAt: new Date(),
    updatedAt: new Date(),
    deleteAt: null,
  };
  
  const testConversationRegister: ConversationRegister = {
    name: 'convo',
    participants: [1],
    messages: [1],
  };
  
  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationService,
        {
          provide: getRepositoryToken(Conversation),
          useValue: mockConversationRepository,
        },
      ],
    }).compile();

    service = testModule.get<ConversationService>(ConversationService);
  });

  describe('findAll', () => {
    it('should return an array of conversations', async () => {
      mockConversationRepository.find.mockResolvedValueOnce([testConversation]);

      const conversations: Conversation[] = await service.findAll();
      expect(conversations).toEqual([testConversation]);
    });

    it('should return an empty array', async () => {
      mockConversationRepository.find.mockResolvedValueOnce([]);

      const result = await service.findAll();

      expect(result).toStrictEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single conversation', async () => {
      mockConversationRepository.findOneBy.mockResolvedValueOnce(testConversation);

      const serviceConversation = await service.findOne(testConversation);
      expect(serviceConversation).toStrictEqual(testConversation);
    });

    it('should be null', async () => {
      const result = await service.findOne({ id: -1 });
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a conversation', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(testConversation);
      const removeSpy =
        mockConversationRepository.remove.mockResolvedValueOnce(undefined);

      await service.remove(testConversation);

      expect(removeSpy).toHaveBeenCalledWith(testConversation);
    });

    it('should not delete a conversation', async () => {
      mockConversationRepository.remove.mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
      try {
        await service.remove({ id: -1 });

        fail('remove() should have thrown BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Conversation not found');
      }
    });
  });

  describe('create', () => {
    it('should create a conversation', async () => {
      mockConversationRepository.create.mockResolvedValueOnce(testConversation);
      const createSpy =
        mockConversationRepository.save.mockResolvedValueOnce(undefined);

      await service.create(testConversationRegister);

      expect(createSpy).toHaveBeenCalledWith(testConversation);
    });
  });
});
