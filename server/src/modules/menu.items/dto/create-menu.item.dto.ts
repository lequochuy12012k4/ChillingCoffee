import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateMenuItemDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    base_price: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsEnum(['drink', 'cake'])
    category: 'drink' | 'cake';
}


