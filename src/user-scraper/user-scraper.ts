export interface UserScraper {
    getAdminToken(): Promise<string>;
}

export const TOKEN_ADMIN_USER_ID = 'TOKEN_ADMIN';
