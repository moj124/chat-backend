import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { HttpException } from '@nestjs/common';

const mockUserService = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),

};

const testUser = {
    id: 1,
    username: "root1",
    password: "root",
    firstName: "first",
    lastName: "last",
} as User;

describe('UserController', () => {
    let controller: UserController;
    let service: UserService;

    beforeEach(async () => {
        const testModule: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: mockUserService,
                }
            ],
        }).compile();

        service = testModule.get<UserService>(UserService);
        controller = testModule.get<UserController>(UserController);
    });

    describe('find', () => {
        it('should find a user', async () => {
            mockUserService.findOne.mockResolvedValueOnce(testUser);
            const result = await controller.find(testUser);

            expect(mockUserService.findOne).toHaveBeenCalled();
            expect(mockUserService.findOne).toHaveBeenCalledWith(testUser.id);
            expect(result).toEqual(testUser);
        });

        it('should not find a user', async () => {
            try {
                await controller.find({} as User);

                fail('remove() should have thrown HttpException');
            } catch (error) {
              expect(error).toBeInstanceOf(HttpException);
              expect(error.message).toBe("userController.find invalid user object");
            }
        });
    });

    describe('findAll', () => {
        it('should a list of all users', async () => {
            mockUserService.findAll.mockResolvedValueOnce([testUser]);
            const result = await controller.findAll();

            expect(mockUserService.findAll).toHaveBeenCalled();
            expect(result).toEqual([testUser]);
        });

        it('should be empty array', async () => {
            mockUserService.findAll.mockResolvedValueOnce([]);
            const result = await controller.findAll();
            expect(result).toEqual([testUser]);
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            mockUserService.findOne.mockResolvedValueOnce(testUser);
            mockUserService.update.mockResolvedValueOnce(testUser);
            const result = await controller.update(1,testUser);

            expect(mockUserService.findOne).toHaveBeenCalled();
            expect(mockUserService.findOne).toHaveBeenCalledWith(1);
            expect(result).toStrictEqual(testUser);

        });
    });
});