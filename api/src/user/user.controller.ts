import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { UserService } from './user.service';

import { RegisterDto } from './dto/register.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async create(@Body() registerDto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('อีเมลนี้ถูกใช้งานแล้ว');
    }
    return this.userService.create(registerDto);
  }
}
