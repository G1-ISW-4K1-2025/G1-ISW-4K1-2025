import axios from 'axios';

const apiURL = 'http://localhost:8000';
const TICKET_PRICE = { Regular: 1000, VIP: 2000 };


const transformDataForBackend = (formData) => {
  const metodo_de_pago = (formData.paymentMethod === 'Tarjeta de Credito') ? 'Tarjeta' : 'Efectivo'

  return {
        forma_pago: metodo_de_pago,
        fecha_visita: formData.visitDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
        id_usuario: Number(formData.userId), 
        entradas: formData.tickets.map(ticket => ({
            edad_visitante: Number(ticket.age),
            tipo_pase: ticket.type,
            precio: TICKET_PRICE[ticket.type] || 0, // Calcula el precio basado en el tipo
        })),
    };
}

export const validateAndCreatePurchase = async (formData) => {
    const payload = transformDataForBackend(formData);

    try {
        const response = await axios.post(`${apiURL}/validar-compra-entradas`, payload);
        if (response.data && response.data.status_code === 200) {
            return response.data;
        } else {
            throw new Error(response.data.message || 'Error desconocido al validar la compra.');
        }
    } catch (error) {
        console.error('Error en validateAndCreatePurchase:', error);
        const backendMessage = error.response?.data?.message || error.message || 'Error de conexión o del servidor.';
        throw new Error(backendMessage);
    }
};

export const postPaymentStatus = async (purchaseId) => {
    try {
        const response = await axios.post(`${apiURL}/procesar-pago/${Number(purchaseId)}`);
        if (response.data && response.data.status_code === 200) {
            return response.data;
        } else {
            throw new Error(response.data.message || 'Error desconocido al procesar el pago.');
        }
    } catch (error) {
        console.error('Error en postPaymentStatus:', error);
        const backendMessage = error.response?.data?.message || error.message || 'Error de conexión o del servidor.';
        throw new Error(backendMessage);
    }
};