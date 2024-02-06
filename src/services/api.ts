import axios from "axios";

const api = axios.create({
    // baseURL: 'http://192.168.2.83:8080/api/v1',
    baseURL: 'https://delivery-demo-production.up.railway.app/api/v1/',
});

export default api;