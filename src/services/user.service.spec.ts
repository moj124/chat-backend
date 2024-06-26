import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { TypeOrmModule } from '../modules/typeorm.module';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
    let service: UserService;
    let userRepository: Repository<User>;
    let dataSource: DataSource;

    const mockUserRepository = {
        find: jest.fn(),
        findOneBy: jest.fn(),
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
        isActive: true,
    } as User;

    beforeEach(async () => {
        const mockDataSource = {
            createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner)
        }

        const testModule: TestingModule = await Test.createTestingModule({
            imports: [TypeOrmModule],
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
        userRepository = testModule.get<Repository<User>>(getRepositoryToken(User));
        dataSource = testModule.get<DataSource>(DataSource);
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

            const users = await service.findAll();
            expect(users).toStrictEqual([]);

        });
    });

    describe('findOne', () => {
        it('should return a single user', async () => {
            mockUserRepository.findOneBy.mockResolvedValueOnce(testUser);

            const serviceUser = await service.findOne(testUser.id);
            expect(serviceUser).toStrictEqual(testUser);

        });

        it('should return null', async () => {
            mockUserRepository.findOneBy.mockResolvedValueOnce(null);

            const user = await service.findOne(-1);
            expect(user).toStrictEqual(null);
        });
    });

    describe('remove', () => {
        it('should delete a user', async () => {
            mockUserRepository.findOneBy.mockResolvedValueOnce(testUser);
            const removeSpy = mockQueryRunner.manager.delete.mockResolvedValueOnce(undefined);
            
            await service.remove(testUser.id);


            expect(removeSpy).toHaveBeenCalledTimes(1);
            expect(removeSpy).toHaveBeenCalledWith(User,testUser);
        });

        it('should not delete a user', async () => {
           jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
            mockQueryRunner.manager.delete.mockResolvedValueOnce(undefined);

            try {
                await service.remove(-1);

                fail('remove() should have thrown NotFoundException');
              } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toBe('User does not exist');
              }

            expect(service.findOne).toHaveBeenCalledTimes(1);
            expect(service.findOne).toHaveBeenCalledWith(-1);

        });
    });
});