export interface MelonAuthdata {
    MAC: string;
    MUG: string;
    MHC: string;
    MUAC: string;
    MUNIK: string;
    MLCP: string;
    MUS: string;
    keyCookie: string;
}

export const MelonAuthdataKeys = ['MAC', 'MUG', 'MHC', 'MUAC', 'MUNIK', 'MLCP', 'MUS', 'keyCookie'];

export interface FloAuthdata {
    accessToken: string;
    refreshToken: string;
}

export const FloAuthdataKeys = ['accessToken', 'refreshToken'];

export interface SpotifyAuthdata {
    _: any;
}

export const SpotifyAuthdataKeys = [];

export type Authdata = MelonAuthdata | FloAuthdata | SpotifyAuthdata;
