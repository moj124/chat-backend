import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

describe('UserController', () => {
    let service: UserService;

    const mockUserRepository = {
        find: jest.fn(),
        findOneBy: jest.fn(),
        create: jest.fn()
    }

    const mockQueryRunner = {
        manager: {
          delete: jest.fn(),
          save: jest.fn(),
        },
        connect: jest.fn(),
        release: jest.fn(),
        startTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        commitTransaction: jest.fn()
      };

    const testUser = {
        username: "root1",
        password: "root",
        firstName: "first",
        lastName: "last",
    } as User;

    beforeEach(async () => {
        const mockDataSource = {
            createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner)
        }

        const testModule: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
            ],
        }).compile();

        service = testModule.get<UserService>(UserService);
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            mockUserRepository.find.mockResolvedValueOnce([testUser]);

            const users: User[] = await service.findAll();
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

        it('should throw an exception', async () => {
            try {
                await service.findOne({ id: -1 });

                fail('findAll() should have thrown BadRequestException');
              } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe('UserService.findOne User not found');
              }
        });
    });

    describe('remove', () => {
        it('should delete a user', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(testUser);
            const removeSpy = mockQueryRunner.manager.delete.mockResolvedValueOnce(undefined);
            
            await service.remove(testUser.id);


            expect(removeSpy).toHaveBeenCalledTimes(1);
            expect(removeSpy).toHaveBeenCalledWith(User,testUser);
        });

        it('should not delete a user', async () => {
            mockQueryRunner.manager.delete.mockResolvedValueOnce(undefined);

            try {
                await service.remove(-1);

                fail('remove() should have thrown BadRequestException');
              } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe("UserService.findOne User not found");
              }
        });
    });

    
    describe('create', () => {
        it('should create a user', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(testUser);

            mockUserRepository.create.mockResolvedValueOnce(testUser);
            const createSpy = mockQueryRunner.manager.save.mockResolvedValueOnce(undefined);

            await service.create(testUser);

            expect(createSpy).toHaveBeenCalled();
            expect(createSpy).toHaveBeenCalledWith(testUser);
        });

        it('should not create a user when already exists', async () => {
            mockUserRepository.create.mockResolvedValueOnce(testUser);
            try {
                await service.create(testUser);

                fail('remove() should have thrown BadRequestException');
            } catch (error) {
              expect(error).toBeInstanceOf(BadRequestException);
              expect(error.message).toBe("UserService.findOne User not found");
            }
        });
    });
});