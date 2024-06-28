import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';

const mockUserService = {
    create: jest.fn(),
};

const testUser = {
    username: "root1",
    password: "root",
    firstName: "first",
    lastName: "last",
    isActive: true,
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

    describe('create', () => {
        it('should create a user', async () => {
            await controller.signUp(testUser);

            expect(mockUserService.create).toHaveBeenCalled();
            expect(mockUserService.create).toHaveBeenCalledWith(testUser);
        });
    });
});