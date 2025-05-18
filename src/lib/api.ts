import axios from 'axios'

interface GenericData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
}

export const api = axios.create({
    baseURL: 'http://localhost:3000/api'
})

// Serviços básicos

export const createSession = async (email: string, senha: string) => {
    return await api.post('/login', {email, senha})
}

export const get = async (table: string) => {
    return await api.get(`/${table}`)   
}

export const create = async (table: string, data: GenericData) => {
    console.log(data)
    return await api.post(`/${table}`, {...data})
}

export const update = async (table: string, id: number, data: GenericData) => {
    console.log(id, data)
    return await api.put(`/${table}/${id}`, {...data})
}

export const remove = async (table: string, id: number) => {
    return await api.delete(`/${table}/${id}`)
}