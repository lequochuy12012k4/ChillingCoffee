import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class GoogleAuthDto {
    @IsNotEmpty({ message: 'Email is required' })
    @IsString({ message: 'Email must be a string' })
    email: string;

    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsOptional()
    @IsString({ message: 'Google ID must be a string' })
    googleId?: string;

    @IsOptional()
    @IsString({ message: 'Image URL must be a string' })
    image?: string;
}
