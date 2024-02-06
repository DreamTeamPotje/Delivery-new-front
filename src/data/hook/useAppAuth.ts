import { useContext } from 'react';
import AppContext from '../context/AppDataContext';

const useAppAuth = () => useContext(AppContext);

export default useAppAuth;