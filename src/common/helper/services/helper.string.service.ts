import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { HelperDateService } from './helper.date.service';
import { IHelperStringRandomOptions } from 'src/common/helper/interfaces/helper.interface';
import { IHelperStringService } from 'src/common/helper/interfaces/helper.string-service.interface';

@Injectable()
export class HelperStringService implements IHelperStringService {
    constructor(private readonly helperDateService: HelperDateService) {}

    checkEmail(email: string): boolean {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    }

    randomReference(length: number, prefix?: string): string {
        const timestamp = `${this.helperDateService.timestamp()}`;
        const randomString: string = this.random(length, {
            safe: true,
            upperCase: true,
        });

        return prefix
            ? `${prefix}-${timestamp}${randomString}`
            : `${timestamp}${randomString}`;
    }

    random(length: number, options?: IHelperStringRandomOptions): string {
        const rString = options?.safe
            ? faker.internet.password({
                  length,
                  prefix: options?.prefix,
              })
            : faker.internet.password({
                  length,
                  prefix: options?.prefix,
              });

        return options?.upperCase ? rString.toUpperCase() : rString;
    }

    censor(value: string): string {
        const length = value.length;
        if (length === 1) {
            return value;
        }

        const end = length > 4 ? length - 4 : 1;
        const censorString = '*'.repeat(end > 10 ? 10 : end);
        const visibleString = value.substring(end, length);
        return `${censorString}${visibleString}`;
    }

    checkPasswordWeak(password: string, length?: number): boolean {
        const regex = new RegExp(
            `^(?=.*?[A-Z])(?=.*?[a-z]).{${length ?? 8},}$`
        );

        return regex.test(password);
    }

    checkPasswordMedium(password: string, length?: number): boolean {
        const regex = new RegExp(
            `^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{${length ?? 8},}$`
        );

        return regex.test(password);
    }

    checkPasswordStrong(password: string, length?: number): boolean {
        const regex = new RegExp(
            `^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{${
                length ?? 8
            },}$`
        );

        return regex.test(password);
    }

    checkSafeString(text: string): boolean {
        const regex = new RegExp('^[A-Za-z0-9_-]+$');
        return regex.test(text);
    }

    convertToSlug(text: string): string {
        return text
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    }

    convertToCamelCase(text: string): string {
        return text
            .replace(/\s(.)/g, ($1) => $1.toUpperCase())
            .replace(/\s/g, '')
            .replace(/^(.)/, ($1) => $1.toLowerCase());
    }

    convertToSnakeCase(text: string): string {
        return text
            .replace(/\s/g, '_')
            .replace(/([A-Z])/g, ($1) => `_${$1.toLowerCase()}`);
    }

    convertToKebabCase(text: string): string {
        return text
            .replace(/\s/g, '-')
            .replace(/([A-Z])/g, ($1) => `-${$1.toLowerCase()}`);
    }

    convertToTitleCase(text: string): string {
        return text
            .toLowerCase()
            .split(' ')
            .map((word) => word.replace(word[0], word[0].toUpperCase()))
            .join(' ');
    }

    convertToSentenceCase(text: string): string {
        return text
            .toLowerCase()
            .replace(/(^\s*\w|[\.\!\?]\s*\w)/g, ($1) => $1.toUpperCase());
    }

    convertToUpperCase(text: string): string {
        return text.toUpperCase();
    }
}
