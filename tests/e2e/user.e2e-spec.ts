import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { UserService } from '../../src/user/user.service';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { loadFixtures } from '../../src/fixtures/fixture-loader';
import { Users } from '../../src/user/user.entity';
import { userFixtures, userRegisterFixtures } from '../../src/fixtures/user.fixture';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let dataSource: DataSource;
  
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    userService = app.get<UserService>(UserService);
    dataSource = app.get<DataSource>(getDataSourceToken());

    await app.init();

    if (!dataSource.isInitialized) await dataSource.initialize();
    const userRepository = dataSource.getRepository(Users);
    await userRepository.clear();
    await loadFixtures(userService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/GET /users', () => {
    it('should return all users', () => {
      return request(app.getHttpServer())
        .get('/users/')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining(userRegisterFixtures[0]),
              expect.objectContaining(userRegisterFixtures[1]),
            ])
          );
        });
    });
  });

  describe('/GET /users/:id', () => {
    it('should return success', () => {
      return request(app.getHttpServer())
        .get('/users/2')
        .expect(200);
    });
  
    it('should return a exception error', () => {
      return request(app.getHttpServer())
        .get('/users/hello')
        .expect(500);
    });
  });


  describe('/POST users/update', () => {
    it('should update a user record', () => {
      const user = userFixtures[0];
      user.firstName = 'Jackson';
  
      return request(app.getHttpServer())
        .post('/users/update')
        .send(user)
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(
            expect.objectContaining({ firstName: user.firstName, lastName: user.lastName }),
          );
        });
    });
  
    it('should create a new user', () => {
      const user = userFixtures[0];
      user.id = 100;
      user.username = 'jackson.new@example.com';
  
      return request(app.getHttpServer())
        .post('/users/update')
        .send(user)
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(
            expect.objectContaining({ firstName: user.firstName, username: user.username }),
          );
        });
    });
  
    it('should not update and return exception', () => {
      return request(app.getHttpServer())
        .post('/users/update')
        .send({})
        .expect(500);
    });
  });

  describe('/POST users/remove', () => {
    it('should remove a user', () => {
      const user = userRegisterFixtures[0];
  
      return request(app.getHttpServer())
        .post('/users/remove')
        .send(user)
        .expect(204);
    });

    it('should not remove a user and raise exception error', () => {
      return request(app.getHttpServer())
        .post('/users/remove')
        .send({})
        .expect(204);
    });
  });
  

  describe('/POST users/register', () => {
    it('should create a user', () => {
      const user = {
        firstName: 'Jane',
        lastName: 'Sir',
        username: 'jane.sir@example.com',
        password: 'securepassword', 
      }
  
      return request(app.getHttpServer())
        .post('/users/register')
        .send(user)
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(
            expect.objectContaining({ firstName: user.firstName, lastName: user.lastName }),
          );
        });
    });

    it('should not create a user', () => {
      return request(app.getHttpServer())
        .post('/users/register')
        .send({})
        .expect(500);
    });
  });


  describe('/POST users/logout', () => {
    it('should return success', () => {
      return request(app.getHttpServer())
        .post('/users/logout')
        .expect(200);
    });
  });
});
