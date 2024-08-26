import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Users } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let service: UserService;

  const mockUserRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
  };

  const testUser = {
    username: 'root1',
    password: 'root',
    firstname: 'first',
    lastname: 'last',
  } as Users;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = testModule.get<UserService>(UserService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUserRepository.find.mockResolvedValueOnce([testUser]);

      const users: Users[] = await service.findAll();
      expect(users).toEqual([testUser]);
    });

    it('should return an empty array', async () => {
      mockUserRepository.find.mockResolvedValueOnce([]);

      const result = await service.findAll();

      expect(result).toStrictEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      mockUserRepository.findOneBy.mockResolvedValueOnce(testUser);

      const serviceUser = await service.findOne(testUser);
      expect(serviceUser).toStrictEqual(testUser);
    });

    it('should be null', async () => {
      const result = await service.findOne({ id: -1 });
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      mockUserRepository.findOneBy.mockResolvedValueOnce(testUser);
      const removeSpy =
      mockUserRepository.delete.mockResolvedValueOnce(undefined);

      await service.remove(testUser);

      expect(removeSpy).toHaveBeenCalledTimes(1);
      expect(removeSpy).toHaveBeenCalledWith(testUser);
    });

    it('should not delete a user', async () => {
      mockUserRepository.delete.mockResolvedValueOnce(undefined);

      try {
        await service.remove({ id: -1 });

        fail('remove() should have thrown NotFoundException');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Users not found');
      }
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      mockUserRepository.create.mockResolvedValueOnce(testUser);
      const createSpy =
      mockUserRepository.save.mockResolvedValueOnce(undefined);

      await service.create(testUser);

      expect(createSpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalledWith(testUser);
    });
  });
});
