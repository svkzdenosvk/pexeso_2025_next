// lib/redux/services/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api', // unikátne meno pre slice
  baseQuery: fetchBaseQuery({
    baseUrl: '/api', // všetky endpointy budú od tohto základu
    credentials: 'include', // aby cookies (token) šli automaticky
  }),
//   tagTypes: ['Auth', 'Game'], // used for cache invalidation
  endpoints: () => ({}), // zatiaľ prázdne, pridáme postupne
});
