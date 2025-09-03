import { IsEmail, IsNotEmpty} from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({message: 'Name is not null'})
    name: string;
    @IsEmail({},{message: 'Email is not valid'})
    email: string;
    @IsNotEmpty({message: 'Password is not null'})
    password: string;
    @IsNotEmpty({message: 'Phone is not null'})
    phone: string;
    @IsNotEmpty({message: 'Address is not null'})
    address: string;
    @IsNotEmpty({message: 'Image is not null'})
    image: string;
}
