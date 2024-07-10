import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { HttpException } from '@nestjs/common';
import { UserLogin, UserRegister } from './user.dto';
import isUser from '../utils/isUser';
import { response } from 'express';
import generateToken from '../utils/generateToken';
import * as bcrypt from 'bcrypt';

const mockUserService = {
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

jest.mock('express');
jest.mock('bcrypt');
jest.mock('../utils/isUser');
jest.mock('../utils/generateToken');
jest.mock('../utils/setCookieJWT');

const testUser = {
  id: 1,
  username: 'root1',
  password: 'root',
  firstName: 'first',
  lastName: 'last',
} as User;

const testRegister = {
  username: 'root1',
  password: 'root',
  firstName: 'first',
  lastName: 'last',
} as UserRegister;

const testLogin = {
  username: 'root1',
  password: 'root',
  firstName: 'first',
  lastName: 'last',
} as UserLogin;

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-secret'; // Mock the environment variable

    const testModule: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
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
      expect(mockUserService.findOne).toHaveBeenCalledWith(testUser);
      expect(result).toEqual(testUser);
    });

    it('should not find a user', async () => {
      try {
        await controller.find({} as User);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('userController.find invalid user object');
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
      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      mockUserService.findOne.mockResolvedValueOnce(testUser);
      mockUserService.update.mockResolvedValueOnce(testUser);
      const result = await controller.update(1, testUser);

      expect(mockUserService.findOne).toHaveBeenCalled();
      expect(mockUserService.findOne).toHaveBeenCalledWith(testUser);
      expect(result).toStrictEqual(testUser);
    });
  });

  describe('register', () => {
    it('should register a user', async () => {
      (isUser as jest.Mock).mockReturnValue(false);
      (generateToken as jest.Mock).mockReturnValue('mocked-token');
      jest.spyOn(service, 'create').mockResolvedValue(testUser);

      const result = await controller.register(testRegister, response);

      expect(result).toStrictEqual(testUser);
    });
    it('should not register a user', async () => {
      (isUser as jest.Mock).mockReturnValue(true);
      (generateToken as jest.Mock).mockReturnValue('mocked-token');

      await expect(
        controller.register(testRegister, response),
      ).rejects.toBeInstanceOf(HttpException);
      await expect(controller.register(testRegister, response)).rejects.toThrow(
        'User already exists',
      );
    });
  });

  describe('logout', () => {
    it('should logout a user', async () => {
      await controller.logout(response);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      (isUser as jest.Mock).mockReturnValue(true);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
      (generateToken as jest.Mock).mockReturnValue('mocked-token');

      jest.spyOn(service, 'findOne').mockResolvedValue(testUser);

      const result = await controller.login(testLogin, response);

      expect(result).toStrictEqual(testUser);
    });
    it('should not login, password mismatch', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(testUser);
      (isUser as jest.Mock).mockReturnValue(true);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

      await expect(
        controller.login(testLogin, response),
      ).rejects.toBeInstanceOf(HttpException);
      await expect(controller.login(testLogin, response)).rejects.toThrow(
        "Password doesn't match",
      );
    });
    it('should not login a user', async () => {
      (isUser as jest.Mock).mockReturnValue(false);

      await expect(
        controller.login(testLogin, response),
      ).rejects.toBeInstanceOf(HttpException);
      await expect(controller.login(testLogin, response)).rejects.toThrow(
        "User doesn't exists",
      );
    });
  });
});
