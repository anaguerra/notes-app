import axios from 'axios'
const baseUrl = '/api/notes'

let token = null

export const setToken = newToken => {
  token = `Bearer ${newToken}`
}

export const create = ({ content, important }) => {
  const config = {
    headers: {
      Authorization: token
    }
  }

  return axios
    .post(baseUrl, { content, important }, config)
    .then(response => {
      const { data } = response
      return data
    })
}

export const getAll = () => {
  return axios.get(baseUrl)
    .then((response) => {
      const { data } = response
      return data
    })
}

export const update = (id, newObject) => {
  const config = {
    headers: {
      Authorization: token
    }
  }

  const request = axios.put(`${baseUrl}/${id}`, newObject, config)
  return request.then(response => response.data)
}
