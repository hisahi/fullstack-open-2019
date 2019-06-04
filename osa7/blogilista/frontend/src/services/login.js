
import { API_BASE } from '../config'
import axios from 'axios'
const baseUrl = API_BASE + '/api/users'
const loginUrl = API_BASE + '/api/login'

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const login = async credentials => {
  const response = await axios.post(loginUrl, credentials)
  return response.data
}

export default { getAll, login }
