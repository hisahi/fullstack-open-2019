
import { API_BASE } from '../config'
import axios from 'axios'
const baseUrl = API_BASE + '/api/blogs'

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const create = async (authUser, newBlog) => {
  const config = {
    headers: { Authorization: 'bearer ' + authUser.token },
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async (authUser, newBlog) => {
  const config = {
    headers: { Authorization: 'bearer ' + authUser.token },
  }

  const response = await axios.put(`${baseUrl}/${newBlog.id}`, newBlog, config)
  console.log(response.data)
  return response.data
}

const remove = async (authUser, blogId) => {
  const config = {
    headers: { Authorization: 'bearer ' + authUser.token },
  }

  const response = await axios.delete(`${baseUrl}/${blogId}`, config)
  return response.data
}

export default { getAll, create, update, remove }
