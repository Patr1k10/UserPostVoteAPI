import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let userId: number;
  let lastUpdateTime: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        username: 'testuser11111',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        role: 'admin',
      })
      .expect(201);

    userId = response.body.id;
  });

  it('should login and get JWT', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'testuser11111',
        password: 'password123',
      })
      .expect(201);

    jwtToken = response.body.access_token;
  });

  it('should get user by ID', async () => {
    const response = await request(app.getHttpServer()).get(`/users/${userId}`).expect(200);
    lastUpdateTime = response.body.updated_at;
  });

  it('should get all users with pagination', () => {
    return request(app.getHttpServer()).get('/users?page=1&limit=10').expect(200);
  });

  it('should update an existing user by ID', () => {
    return request(app.getHttpServer())
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .set('if-unmodified-since', lastUpdateTime)
      .send({
        username: 'updateduser1',
        firstName: 'Jane',
        lastName: 'Doe',
        password: 'newpassword123',
      })
      .expect(200);
  });

  it('should soft-delete a user by ID', () => {
    return request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
  });
});
