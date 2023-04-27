export function fetchImages(name) {
  const BASE_URL = 'https://pixabay.com/api/';
  // const END_POINT = 'name/';
  // const FILTER = '?fields=name,capital,population,flags,languages';
  const API_KEY = "35829510-9a51be363aad92e9acd99befc";
  return fetch(`${BASE_URL}${END_POINT}${name}${FILTER}`).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp.json();
  });
}
