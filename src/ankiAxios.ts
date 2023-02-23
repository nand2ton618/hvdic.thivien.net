import axios from 'axios'

const ankiAxios = axios.create({
  baseURL: 'http://127.0.0.1:8765/',
  proxy: false,
  httpAgent: false,
})

export default ankiAxios
