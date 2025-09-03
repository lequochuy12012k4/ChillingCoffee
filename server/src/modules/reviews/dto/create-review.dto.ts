import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
    @IsMongoId()
    user: string;

    @IsOptional()
    @IsMongoId()
    menuItem?: string;

    @IsOptional()
    @IsString()
    productText?: string;

    @IsNumber()
    rating: number;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsString()
    comment?: string;
}


