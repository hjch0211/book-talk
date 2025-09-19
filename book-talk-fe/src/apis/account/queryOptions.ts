import {queryOptions} from '@tanstack/react-query';
import {getMyAccount} from './api';

export const meQueryOption = queryOptions({
    queryKey: ['account', 'me'],
    queryFn: async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return null;
        return await getMyAccount();
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
})