import { IsNotEmpty, IsString } from "class-validator";

export class ActivateAccountDto {
    @IsNotEmpty({ message: 'Activation code is required' })
    @IsString({ message: 'Activation code must be a string' })
    code: string;
}
