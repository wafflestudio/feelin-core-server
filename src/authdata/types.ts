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
    accessToken: string;
}

export const SpotifyAuthdataKeys = ['accessToken'];

export interface ApplemusicAuthdata {
    accessToken: string;
}

export const ApplemusicAuthdataKeys = ['accessToken'];

export type Authdata = MelonAuthdata | FloAuthdata | SpotifyAuthdata | ApplemusicAuthdata;
