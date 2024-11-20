import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty } from 'class-validator';

export class UserBlockedDto {
    @ApiProperty({
        name: 'blocked',
        required: false,
    })
    @IsBoolean()
    blocked: boolean;

    @ApiProperty({
        name: 'blockedDate',
        nullable: false,
    })
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    blockedDate: Date;
}
