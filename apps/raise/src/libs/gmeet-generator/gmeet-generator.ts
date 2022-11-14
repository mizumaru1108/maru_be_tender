import axios from 'axios';

export async function gmeetGenerator() {
  // create axios.get request to get the data from the url https://meet.google.com/new and return the link
  const { data } = await axios.get('https://meet.google.com/new');
  return data;
}
