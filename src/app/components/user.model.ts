export interface User {
    username: string;
    password?: string;
    email?: string;
    team_id?: string;
    team_name?: string;
    profile_pic_url?: string;
    token_type?: string;
    access_token?: string;
}

export interface Team {
    team_id: number;
    team_name: string;
}
