import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'รูปแบบอีเมลไม่ถูกต้อง' })
    @IsNotEmpty({ message: 'กรุณากรอกอีเมล' })
    readonly email: string;

    @IsNotEmpty({ message: 'กรุณากรอกรหัสผ่าน' })
    readonly password: string;
}
