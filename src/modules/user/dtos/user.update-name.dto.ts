import { PickType } from '@nestjs/swagger';
import { UserCreateDto } from './user.create.dto';

export class UserUpdateNameDto extends PickType(UserCreateDto, [
    'fullName',
] as const) {}
