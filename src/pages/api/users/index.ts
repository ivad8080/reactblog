import { NextApiRequest, NextApiResponse } from 'next';

export default (request: NextApiRequest, response: NextApiResponse) => {
  const users = [
    { id: 1, name: 'Davi'},
    { id: 2, name: 'Luciana'},
    { id: 3, name: 'Mucuruxa'},
  ]
  return response.json(users)
}