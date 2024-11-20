import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { CATEGORY_TYPE } from '../constants/categories.enum.constant';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';

export class CategoryGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        description: 'Category name',
        example: faker.commerce.department(),
    })
    readonly name: string;

    @ApiProperty({
        example: faker.commerce.department(),
    })
    readonly description: string;

    @ApiProperty({
        example: faker.helpers.arrayElement(Object.values(CATEGORY_TYPE)),
    })
    readonly type: string;

    @ApiProperty({
        example: faker.helpers.slugify(faker.commerce.department()),
    })
    readonly slug: string;
}
