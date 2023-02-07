import { Injectable } from '@nestjs/common';

@Injectable()
export class ImagePickerUtilService {
    static pickImageOfSize<T extends { width: number; height: number; url: string }>(images: T[], size: number): string {
        const sorted = images.sort((a, b) => b.width - a.width);
        const image = sorted.find((image) => image.width >= size);
        if (image) {
            return image.url;
        }
        return images?.[0]?.url;
    }
}
