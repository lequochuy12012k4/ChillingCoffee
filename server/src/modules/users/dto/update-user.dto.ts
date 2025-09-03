import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateUserDto{
    @IsMongoId({message: 'Id is not valid'})
    @IsNotEmpty({message: 'Id is not null'})
    _id: string;
    @IsOptional()
    name: string;
    @IsOptional()
    phone: string;
    @IsOptional()
    address: string
    @IsOptional()
    image: string;
}
