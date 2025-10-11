import axios from 'axios';

const apiURL = 'http://localhost:8000';

export const getSaludo = async () => {
  try {
    const response = await axios.get(`${apiURL}/`);
    return response.data;
  } catch (error) {
    console.error('Error en obtener saludo:', error);
    throw error;
  }
};