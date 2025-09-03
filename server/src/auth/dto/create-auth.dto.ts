import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateAuthDto {
    
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @IsOptional()
    name: string;
}

export class ForgotPasswordDto {
    @IsNotEmpty({ message: 'Email is required' })
    email: string;
}

export class ResetPasswordDto {
    @IsNotEmpty({ message: 'Token is required' })
    token: string;

    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}