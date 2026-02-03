import { IsEmail, IsNotEmpty, IsOptional, MinLength, IsEnum } from 'class-validator';
import { Role } from '../../entities/user.entity';

export class RegisterDto {
  @IsEmail({}, { message: 'รูปแบบอีเมลไม่ถูกต้อง' })
  @IsNotEmpty({ message: 'กรุณากรอกอีเมล' })
  readonly email: string;

  @IsNotEmpty({ message: 'กรุณากรอกรหัสผ่าน' })
  @MinLength(6, { message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' })
  readonly password: string;

  @IsOptional()
  readonly name: string;

  @IsOptional()
  readonly tel: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role ต้องเป็น ADMIN, USER, หรือ MANAGER เท่านั้น' })
  readonly role?: Role;
}
