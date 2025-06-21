import { toast } from 'react-toastify';
import api from './api';

const getToken = () => localStorage.getItem('token');

export const callApi = async (method, endpoint, data = {}, isMultipart = false) => {
  try {
    const config = {
      method,
      url: endpoint,
      headers: {
        'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    };

    if (method === 'get' || method === 'delete') {
      config.params = data;
    } else {
      config.data = data;
    }

    const response = await api(config);
    toast.success(response.data.message)
    
    return response.data;
  } catch (error) {
    toast.error(error.response?.data.message || 'Network Error!')
    throw error;
  }
};

