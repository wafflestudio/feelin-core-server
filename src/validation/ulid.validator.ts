import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsULID(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'isULID',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return typeof value === 'string' && /^[0-9A-Z]{26}$/.test(value);
                },
            },
        });
    };
}
