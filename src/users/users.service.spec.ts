import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';
import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from '../entities/users.entity';
import { UserUpdateDto } from './dto/updateUser.dto';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository: jest.Mocked<Repository<User>>;
  const mockJwtService = { sign: jest.fn() };
  const mockPinoLogger = { setContext: jest.fn(), error: jest.fn(), warn: jest.fn(), info: jest.fn() };

  const mockUser: User = {
    id: 1,
    username: 'John',
    firstName: 'John',
    lastName: 'Doe',
    password: 'password',
    role: 'moderator',
    rating: 0,
    posts: Promise.resolve([]),
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    avatarUrl: null,
  };

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      softDelete: jest.fn(),
      create: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PinoLogger, useValue: mockPinoLogger },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('createUser', () => {
    const createUserDto: CreateUserDto = {
      username: 'John',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
      role: 'moderator',
    };

    it('should create a user', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.save.mockResolvedValue(mockUser);
      mockRepository.create.mockReturnValue(mockUser);

      const result = await service.createUser(createUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw a ConflictException if username already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.createUser(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('updateUser', () => {
    const userUpdateDto: UserUpdateDto = {
      username: 'JohnUpdated',
      firstName: 'John',
      lastName: 'Doe',
      password: 'newPassword',
      role: 'admin',
    };

    it('should update a user', async () => {
      jest.spyOn(service, 'hashPassword').mockResolvedValue('hashedPassword');

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue({ ...mockUser, ...userUpdateDto, password: 'hashedPassword' });

      const result = await service.updateUser(1, userUpdateDto);
      expect(result).toEqual({ ...mockUser, ...userUpdateDto, password: 'hashedPassword' });
    });

    it('should throw a NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.updateUser(1, userUpdateDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw a ConflictException if username already exists', async () => {
      const anotherUser = { ...mockUser, id: 2 };
      mockRepository.findOne.mockResolvedValueOnce(mockUser).mockResolvedValueOnce(anotherUser);

      await expect(service.updateUser(1, userUpdateDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('softDeleteUser', () => {
    it('should soft delete a user', async () => {
      mockRepository.softDelete.mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });

      await expect(service.softDeleteUser(1)).resolves.not.toThrow();
    });

    it('should throw a NotFoundException if user not found', async () => {
      mockRepository.softDelete.mockResolvedValue({ affected: 0, raw: [], generatedMaps: [] });

      await expect(service.softDeleteUser(1)).rejects.toThrow(NotFoundException);
    });
  });
  describe('findByUsername', () => {
    it('should find a user by username', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByUsername('John');
      expect(result).toEqual(mockUser);
    });

    it('should throw a NotFoundException if username not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findByUsername('John')).rejects.toThrow(NotFoundException);
    });
  });
  describe('findUserByFields', () => {
    it('should find a user by fields', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const mockGetUserDto = {
        id: 1,
        username: 'John',
        password: 'password',
      };

      const result = await service.findUserByFields(mockGetUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw a NotFoundException if no user matches the criteria', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const mockGetUserDto = {
        id: 1,
        username: 'John',
        password: 'password',
      };

      await expect(service.findUserByFields(mockGetUserDto)).rejects.toThrow(NotFoundException);
    });
  });
  describe('validateUser', () => {
    it('should return the user if validation is successful', async () => {
      const mockUser = {
        username: 'John',
        password: 'hashedPassword',
      };

      service.findByUsername = jest.fn().mockResolvedValue(mockUser);
      service.comparePasswords = jest.fn().mockReturnValue(true);

      const result = await service.validateUser('John', 'correctPassword');
      expect(result).toEqual(mockUser);
    });

    it('should throw an UnauthorizedException if the user is not found', async () => {
      service.findByUsername = jest.fn().mockResolvedValue(null);

      await expect(service.validateUser('John', 'somePassword')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an UnauthorizedException if the password is incorrect', async () => {
      const mockUser = {
        username: 'John',
        password: 'hashedPassword',
      };

      service.findByUsername = jest.fn().mockResolvedValue(mockUser);
      service.comparePasswords = jest.fn().mockReturnValue(false);

      await expect(service.validateUser('John', 'wrongPassword')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return an access token if login is successful', async () => {
      const mockUser = {
        id: 1,
        username: 'John',
        password: 'correctPassword',
      };

      const mockToken = 'someAccessToken';

      service.validateUser = jest.fn().mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login({ username: 'John', password: 'correctPassword' });
      expect(result).toEqual({ access_token: mockToken });
    });

    it('should throw an UnauthorizedException if validateUser returns null', async () => {
      service.validateUser = jest.fn().mockResolvedValue(null);

      await expect(service.login({ username: 'John', password: 'wrongPassword' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw a BadRequestException if the user ID is invalid', async () => {
      const mockUser = {
        id: NaN,
        username: 'John',
        password: 'correctPassword',
      };

      service.validateUser = jest.fn().mockResolvedValue(mockUser);

      await expect(service.login({ username: 'John', password: 'correctPassword' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
