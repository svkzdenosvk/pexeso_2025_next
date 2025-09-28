// redux/services/authApi.ts
import { apiSlice } from './apiSlice';
import { setUser, clearUser } from '../store/reducers/authSlice';

import type { My_Type_User, My_Type_Login } from '@pexeso/_inc/my_types';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      { user: My_Type_User; name?: string },
      My_Type_Login 
    >({
      query: (credentials) => ({
        url: '/login', // zodpovedá tvojej route /api/login
        method: 'POST',
        body: credentials,
      }),
      // async onQueryStarted(arg, { dispatch, queryFulfilled }) {
      //   //maybe onQueryStarted is not needed when  useAuthCheck .. will see
      //   try {
      //     const { data } = await queryFulfilled;
      //     dispatch(
      //       setUser({
      //         uid: data.user.uid,
      //         email: data.user.email,
      //         name: data?.name ?? '',
      //       })
      //     );
      //   } catch {
      //     dispatch(clearUser());
      //   }
      // },
    }),

    // Registration endpoint
    register: builder.mutation<
      any,
      { name: string; email: string; password: string }
    >({
      query: (formData) => ({
        url: '/registration',
        method: 'POST',
        body: formData,
      }),
    }),

    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/logout',
        method: 'GET',
      }),
    }),
    
    authMe: builder.query<
      { isLoggedIn: boolean; uid?: string; email?: string; name?: string },
      void
    >({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
        credentials: 'include',
      }),
    }),

   
    // login: builder.mutation<{ user: My_Type_User }, My_Type_Login>({
    //   query: (credentials) => ({
    //     url: '/auth/login',
    //     method: 'POST',
    //     body: credentials,
    //   }),
    // }),

    // register: builder.mutation<{ user: My_Type_User }, void>({
    //   query: (payload) => ({
    //     url: '/auth/register',
    //     method: 'POST',
    //     body: payload,
    //   }),
    // }),

  }),
});

// RTK Query automaticky generuje hooky:
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useAuthMeQuery,
} = authApi;
