import { IHelperStringRandomOptions } from 'src/common/helper/interfaces/helper.interface';

export interface IHelperStringService {
    checkEmail(email: string): boolean;

    randomReference(length: number, prefix?: string): string;

    random(length: number, options?: IHelperStringRandomOptions): string;

    censor(value: string): string;

    checkPasswordWeak(password: string, length?: number): boolean;

    checkPasswordMedium(password: string, length?: number): boolean;

    checkPasswordStrong(password: string, length?: number): boolean;

    checkSafeString(text: string): boolean;

    convertToSlug(text: string): string;

    convertToCamelCase(text: string): string;

    convertToSnakeCase(text: string): string;

    convertToKebabCase(text: string): string;

    convertToTitleCase(text: string): string;

    convertToSentenceCase(text: string): string;

    convertToUpperCase(text: string): string;
}
