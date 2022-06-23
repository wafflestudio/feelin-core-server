import { IsString } from 'class-validator';

export class SearchTrackDto {
    @IsString()
    title!: string;
}
