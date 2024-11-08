import {
  INestApplication,
  ValidationPipe
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';

import { PrismaService } from '../src/prisma/prisma.service';
import {AuthDto} from "../dist/auth/dto";
import {EditUserDto} from "../src/user/dto";
import {CreateBookmarkDto, EditBookmarkDto} from "../src/bookmark/dto";



describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true
      })
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDB();
    pactum.request.setBaseUrl(
      'http://localhost:3333',
    );
  });

  afterAll(() => {
    app.close();
  })

  describe('Auth',  () => {
    const dto: AuthDto = {
      email: 'abcds@wew.com',
      password: '12345',
    };
    describe('Signup', function () {
      it('should throw error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password
          })
          .expectStatus(400);
      });
      it('should throw error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email
          })
          .expectStatus(400);
      });
      it('should throw error if email and password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', function () {
      let accessToken: string
      it('should throw error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password
          })
          .expectStatus(400);
      });
      it('should throw error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email
          })
          .expectStatus(400);
      });
      it('should throw error if email and password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(400);
      });
      it('should sign in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('accessToken', 'access_token');
      });
    });
  });

  describe('User',  () => {
    describe('Get me', function () {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .expectStatus(200);
      })
    });
    
    describe('Edit user', function () {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'Virat',
          email: 'virat@example.com'
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      })
    });
  });

  describe('Bookmarks',  () => {
    describe('Get empty bookmarks', () => {
        it('should get bookmarks', () => {
          return pactum
            .spec()
            .get('/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{accessToken}'
            })
            .expectStatus(200)
            .expectBody([])
        })
    });

    describe('Create bookmark',  () => {
      const dto: CreateBookmarkDto = {
        title: 'First bookmark',
        link: 'https://youtube.com/ansdjsd',
      }
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .withBody(dto)
          .expectStatus(201)
          .inspect()
          .expectBodyContains(dto.title)
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get bookmarks',  () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .expectStatus(200)
          .expectJsonLength(1)
      });
    });

    describe('Get bookmark by id',  () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .expectStatus(200)
          .inspect()
          .expectBodyContains('$S{bookmarkId}');
      });
    });

    describe('Edit bookmark',  () => {
      const dto: EditBookmarkDto = {
        title: 'New title',
        description: 'Some description'
      };

      it('should update the bookmark by id', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
      });

    });

    describe('Delete bookmark by id',  () => {
      it('should delete bookmark by id', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .expectStatus(204)
          .inspect()
          .expectBodyContains('');
      });
      it('should get empty bookmark', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
