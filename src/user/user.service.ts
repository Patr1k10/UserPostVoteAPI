import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { User } from './entities/user.entity';
import { UserDto } from './dto/create-user.dto';
import { UserUpdateDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
    logger.setContext(UserService.name);
  }

  async createUser(userDto: UserDto): Promise<User> {
    try {
      this.logger.info(`Attempting to create user: ${JSON.stringify(userDto)}`);
      const existingUser = await this.userRepository.findOne({ where: { username: userDto.username } });
      if (existingUser) {
        this.logger.warn(`Username already exists: ${userDto.username}`);
        throw new ConflictException('Username already exists');
      }
      const user = new User(
        userDto.username,
        userDto.firstName,
        userDto.lastName,
        await this.hashPassword(userDto.password),
        userDto.role,
      );
      this.logger.info(`Successfully created user: ${JSON.stringify(user)}`);
      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(`Error occurred while creating user: ${error.message}`);
      throw error;
    }
  }

  async updateUser(id: number, updateUserDto: UserUpdateDto): Promise<User> {
    try {
      this.logger.info(`Attempting to update user with ID: ${id}`);
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        this.logger.warn(`User not found with ID: ${id}`);
        throw new NotFoundException('User not found');
      }
      if (updateUserDto.username) {
        const existingUser = await this.userRepository.findOne({ where: { username: updateUserDto.username } });
        if (existingUser && existingUser.id !== id) {
          this.logger.warn(`Username already exists: ${updateUserDto.username}`);
          throw new ConflictException('Username already exists');
        }
      }
      if (updateUserDto.password) {
        updateUserDto.password = await this.hashPassword(updateUserDto.password);
      }
      this.logger.info(`Successfully updated user with ID: ${id}`);
      return await this.userRepository.save({ ...user, ...updateUserDto });
    } catch (error) {
      this.logger.error(`Error occurred while updating user: ${error.message}`);
      throw error;
    }
  }

  async softDeleteUser(id: number): Promise<void> {
    try {
      this.logger.info(`Attempting to soft-delete user with ID: ${id}`);
      const result = await this.userRepository.softDelete(id);
      if (result.affected === 0) {
        this.logger.warn(`User not found with ID: ${id}`);
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      this.logger.info(`Successfully soft-deleted user with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error occurred while soft-deleting user: ${error.message}`);
      throw error;
    }
  }

  async findByUsername(username: string): Promise<UserDto | undefined> {
    try {
      return this.userRepository.findOne({ where: { username } });
    } catch (error) {
      this.logger.error(`Error finding user by username: ${error.message}`);
      throw error;
    }
  }

  async getUserById(id: number): Promise<GetUserDto> {
    const user = await this.userRepository.createQueryBuilder('user').where({ id }).getOne();
    if (!user) {
      throw new Error('User is not found');
    }
    return user;
  }

  async findAllWithPagination(
    page: number,
    limit: number,
  ): Promise<{ users: User[]; total: number; page: number; limit: number }> {
    try {
      const skip = (page - 1) * limit;

      const [users, total] = await this.userRepository
        .createQueryBuilder('user')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return { users, total, page, limit };
    } catch (error) {
      this.logger.error(`Error fetching users with pagination: ${error.message}`);
      throw error;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      const salt = crypto.randomBytes(16).toString('hex');
      const derivedKey = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
      return `${salt}:${derivedKey}`;
    } catch (error) {
      this.logger.error(`Error hashing password: ${error.message}`);
      throw error;
    }
  }

  async validateUser(username: string, password: string): Promise<UserDto | null> {
    try {
      this.logger.info(`Validating user with username: ${username}`);
      const user = await this.findByUsername(username);
      if (user && this.comparePasswords(password, user.password)) {
        this.logger.info(`User validated: ${JSON.stringify(user)}`);
        return user;
      }
      return null;
    } catch (error) {
      this.logger.error(`Error validating user: ${error.message}`);
      throw error;
    }
  }

  async login(user: User): Promise<{ access_token: string }> {
    try {
      this.logger.info(`Logging in user: ${user.username}`);
      const payload = { username: user.username, sub: user.id };
      const accessToken = this.jwtService.sign(payload);
      this.logger.info(`User logged in: ${user.username}`);
      return { access_token: accessToken };
    } catch (error) {
      this.logger.error(`Error logging in user: ${error.message}`);
      throw error;
    }
  }

  private comparePasswords(password: string, userPasswordHash: string): boolean {
    try {
      const [salt, userHash] = userPasswordHash.split(':');
      const derivedKey = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
      return userHash === derivedKey;
    } catch (error) {
      this.logger.error(`Error comparing passwords: ${error.message}`);
      throw error;
    }
  }
}
