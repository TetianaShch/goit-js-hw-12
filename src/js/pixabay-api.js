import axios from 'axios';
export const PER_PAGE = 15;

const API_KEY = '52852396-2e2f44ee304cf9c0c54250cb9'; 
const BASE_URL = 'https://pixabay.com/api/';



export async function getImagesByQuery(query, page = 1) {
  const { data } = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: String(query).trim(),
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: PER_PAGE,
      page,
    },
  });
  return data;
}
