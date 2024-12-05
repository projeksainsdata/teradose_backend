import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { UserCreateDto } from './user.create.dto';
import { IsPasswordStrong } from 'src/common/request/validations/request.is-password-strong.validation';
import { faker } from '@faker-js/faker';
import { IsOptional } from 'class-validator';

export class UserUpdateDto extends PartialType(
    OmitType(UserCreateDto, ['email'] as const)
) {
    @ApiProperty({
        description: 'string password',
        example: `${faker.string.alphanumeric(5).toLowerCase()}${faker.string.alphanumeric(5).toUpperCase()}@@!123`,
    })
    @IsOptional()
    @IsPasswordStrong()
    set password(value: string) {
        if (value !== "") {
            this._password = value;
        }
    }
    get password(): string {
        return this._password;
    }
    private _password: string;
}
