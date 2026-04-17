import { useState, useCallback } from 'react';
import axios from 'axios';
import config from '../clientConfig';

const apiUrl = (path) => {
  const base = config.apiBaseUrl || '';
  return base ? `${base.replace(/\/$/, '')}/${path}` : `/${path}`;
};

export const useLedger = () => {
const [pagination, setPagination] = useState({ total: 0, limit: 20, offset: 0, hasMore: false });
const [transactions, setTransactions] = useState([]);
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);

const fetchLedger = useCallback(async ({ limit = 20, offset = 0 } = {}) => {
    setLoading(true);
    setError(null);
    try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(apiUrl('api/ledger'), {
            params: { limit, offset },
            headers: { 'x-auth-token': token },
        });
        setPagination(data.data.pagination);
        setTransactions(data.data.transactions);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load transactions');
         } finally {
        setLoading(false);
         }
     }, []);
    return { transactions, pagination, loading, error, fetchLedger };
};
