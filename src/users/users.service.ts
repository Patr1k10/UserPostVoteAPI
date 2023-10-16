import * as crypto from 'crypto';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { UserUpdateDto } from './dto/updateUser.dto';
import { User } from '../entities/users.entity';
import { GetUserDto } from './dto/get.user.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UserAuthDto } from './dto/authUser.dto';

dotenv.config();

@ApiTags('Users')
@Injectable()
export class UsersService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
    logger.setContext(UsersService.name);
  }

  @ApiProperty({ description: 'Creates a new users' })
  async createUser(userDto: CreateUserDto): Promise<CreateUserDto> {
    const existingUser = await this.userRepository.findOne({
      where: {
        username: userDto.username,
      },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    const hashedPassword = await this.hashPassword(userDto.password);
    const user = this.userRepository.create({ ...userDto, password: hashedPassword });
    return this.userRepository.save(user);
  }

  @ApiProperty({ description: 'Updates an existing users by ID' })
  async updateUser(id: number, updateUserDto: UserUpdateDto, ifUnmodifiedSince?: string): Promise<UserUpdateDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.warn(`User not found with ID: ${id}`);
      throw new NotFoundException('User not found');
    }
    if (
      ifUnmodifiedSince &&
      Math.floor(new Date(ifUnmodifiedSince).getTime() / 1000) !==
        Math.floor(new Date(user.updated_at).getTime() / 1000)
    ) {
      throw new BadRequestException('Resource has been modified');
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
    return this.userRepository.save({ ...user, ...updateUserDto });
  }

  @ApiProperty({ description: 'Soft-deletes a users by ID' })
  async softDeleteUser(id: number): Promise<void> {
    this.logger.info(`Attempting to soft-delete user with ID: ${id}`);
    const result = await this.userRepository.softDelete(id);
    if (result.affected === 0) {
      this.logger.warn(`User not found with ID: ${id}`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.logger.info(`Successfully soft-deleted user with ID: ${id}`);
  }

  @ApiProperty({ description: 'Finds a users by username' })
  async findByUsername(username: string): Promise<GetUserDto | undefined> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!username || typeof username !== 'string' || username.length === 0) {
      this.logger.error(`Invalid username: ${username}`);
      throw new BadRequestException('Invalid username');
    }
    if (!user) {
      this.logger.error(`User not found with username: ${username}`);
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  @ApiProperty({ description: 'Gets a users by ID' })
  async getUserById(id: number): Promise<GetUserDto> {
    const user = await this.userRepository.createQueryBuilder('user').where({ id }).getOne();
    if (!user) {
      throw new Error('User is not found');
    }
    if (!user.id || typeof user.id !== 'number' || Number.isNaN(user.id)) {
      throw new BadRequestException('Invalid user ID');
    }
    this.logger.info(`Successfully fetched user with ID: ${id}`);
    return user;
  }

  @ApiProperty({ description: 'Finds a users by various fields' })
  async findUserByFields(query: GetUserDto): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({ where: query });
    if (!user) {
      this.logger.error('No users found matching the given criteria');
      throw new NotFoundException('No users found matching the given criteria');
    }
    return user;
  }

  @ApiProperty({ description: 'Finds all users with pagination' })
  async findAllWithPagination(
    page: number,
    limit: number,
  ): Promise<{ users: User[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await this.userRepository
      .createQueryBuilder('user')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    if (!users.length) {
      this.logger.error('No users found with the given pagination settings');
      throw new NotFoundException('No users found');
    }

    return { users, total, page, limit };
  }

  async hashPassword(password: string): Promise<string> {
    try {
      const salt = crypto.randomBytes(16).toString('hex');
      const derivedKey = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
      return `${salt}:${derivedKey}`;
    } catch (error) {
      this.logger.error(`Error hashing password: ${error.message}`);
      throw error;
    }
  }

  async validateUser(username: string, password: string): Promise<UserAuthDto | null> {
    const user = await this.findByUsername(username);

    if (user && this.comparePasswords(password, user.password)) {
      this.logger.info(`User validated: ${JSON.stringify(user)}`);
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  @ApiProperty({ description: 'Login users' })
  async login(userDto: UserAuthDto): Promise<{ access_token: string }> {
    const user = await this.validateUser(userDto.username, userDto.password);

    if (!user) {
      this.logger.error('Invalid credentials');
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.id || typeof user.id !== 'number' || Number.isNaN(user.id)) {
      this.logger.error(`Invalid user ID: ${user.id}`);
      throw new BadRequestException('Invalid users ID');
    }

    const payload = { sub: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload);
    this.logger.info(`User logged in: ${user.username}`);

    return { access_token: accessToken };
  }

  comparePasswords(password: string, userPasswordHash: string): boolean {
    try {
      const [salt, userHash] = userPasswordHash.split(':');
      const derivedKey = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
      return userHash === derivedKey;
    } catch (error) {
      this.logger.error(`Error comparing passwords: ${error.message}`);
      throw error;
    }
  }

  @ApiProperty({ description: 'Get signed URL for avatar upload' })
  async getSignedUrl(user: GetUserDto): Promise<string> {
    try {
      const userId = user.id;
      const response = await axios.post(process.env.URL_API_LAMBDA, { userId });
      return response.data.uploadUrl;
    } catch (error) {
      this.logger.error(`Error getting signed URL: ${error.message}`);
      throw error;
    }
  }

  @ApiProperty({ description: 'Upload avatar' })
  async uploadAvatar(uploadUrl: string, fileBuffer: Buffer, mimeType: string): Promise<void> {
    try {
      await axios.put(uploadUrl, fileBuffer, {
        headers: {
          'Content-Type': mimeType,
        },
      });
    } catch (error) {
      this.logger.error(`Error uploading avatar: ${error.message}`);
      throw error;
    }
  }
}
