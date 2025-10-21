import axios from 'axios';

const apiURL = 'http://localhost:8000';

export const checkApiStatus = async () => {
    try {
        const response = await axios.get(`${apiURL}/`);
        return response.data; 

    } catch (error) { 
        console.error('Error al chequear status de la API:', error);
        const backendMessage = error.response?.data?.message || 
                               error.response?.data?.detail || 
                               error.message || 
                               'Error de conexión o del servidor.';
                               
        throw new Error(backendMessage);
    }
};