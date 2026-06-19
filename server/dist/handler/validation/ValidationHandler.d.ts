import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class ValidationHandler implements PipeTransform<any> {
    transform(value: any, { metatype }: ArgumentMetadata): Promise<any>;
    private toValidate;
}
