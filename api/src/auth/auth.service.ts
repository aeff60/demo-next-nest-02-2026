import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service'
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
constructor(
  private userService: UserService,
  private jwtService: JwtService,
) {}

async validateUser(email: string, password: string) : Promise<any> {
  const user = await this.userService.findByEmail(email);

  if (user && (await bcrypt.compare(password, user.password))) {
    if (!user.isActive) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
return null;
}

async login(user: any) {
  const payload = { 
    sub: user.id,
    email: user.email,
    role: user.role,
  };
  
  return {
    access_token: this.jwtService.sign(payload),
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}
}