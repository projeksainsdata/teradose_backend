import { registerAs } from '@nestjs/config';

export default registerAs(
    'user',
    (): Record<string, any> => ({
        uploadPath: '/users',
        mobileNumberCountryCodeAllowed: ['628', '658'],
    })
);
