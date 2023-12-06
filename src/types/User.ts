export interface IUserData {
    id?: any | null,
    firstname: string,
    name: string,
    telephone : string, 
    email : string , 
    status : number , 
    role : string , 
    position : number,
    published?: boolean,
}

export interface API_Response {
    totalUsers: number;
    users: IUserData[];
    totalPages: number;
    currentPage: number;
}

export interface API_Params {
    page?: number;
    size?: number;
    title?: string;
}