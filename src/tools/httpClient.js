import axios from 'axios'

export const URL = 'https://minfin.com.ua/ua/currency/'

const httpClient = axios.create({
  baseURL: URL,
})

export default httpClient