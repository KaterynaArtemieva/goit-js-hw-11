import axios from 'axios';
export async function fetchImages(nameImg, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '35829510-9a51be363aad92e9acd99befc';
  let res = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${nameImg}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);
  let data = res.data;
  return data;
}