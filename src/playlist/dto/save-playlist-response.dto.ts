import { TrackDto } from '@/track/dto/track.dto.js';

export class SavePlaylistResponseDto {
    success!: boolean;

    missingTracks?: TrackDto[];

    constructor(success: boolean, missingTracks?: TrackDto[]) {
        this.success = success;
        this.missingTracks = missingTracks;
    }
}
