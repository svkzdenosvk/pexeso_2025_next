
import axios from 'axios';

export const _graphqlRequest = async (query: string) => {
  const res = await axios.post('/api/graphql', { query }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return res.data; // contains { data: { images: ... } }
};
