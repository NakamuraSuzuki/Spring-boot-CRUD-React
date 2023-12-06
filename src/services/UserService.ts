// Axios Config
// Interfaces
import { IUserData, API_Response, API_Params } from '../types/User';
import UserApi from './../api/UserApi';

export const getAllItem = () => {
    return UserApi.get<IUserData[]>('/all')
}

export const getItem = (id: string) => {
    return UserApi.get<IUserData>(`/users/${id}`)
}

export const createItem = (data: IUserData) => {
    return UserApi.post<IUserData>('/add', data)
}

export const updateItem = (id: number, data: IUserData) => {
    return UserApi.put<IUserData>(`/update/${id}`, data)
}

export const removeItem = (id: string) => {
    return UserApi.delete<IUserData>(`/remove/${id}`)
}