import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { My_Type_User, My_Type_AuthState } from '@pexeso/_inc/my_types';

/**
 * Redux slice for authentication state management.
 *
 * State shape:
 * {
 *   user: null | My_Type_User
 * }
 *
 * Features:
 * - Stores authenticated user data
 * - Allows setting and clearing user
 *
 * Used throughout the app to check if a user is logged in or a guest.
 */

// Initial state: starts with no user (unauthenticated or guest)
const initialState: My_Type_AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: 'auth', // Slice name used in the Redux state tree
  initialState,
  reducers: {
    /**
     * Sets the current authenticated user.
     * @param action.payload - User object of type My_Type_User
     */
    setUser(state, action: PayloadAction<My_Type_User>) {
      state.user = action.payload;
    },

    // Clears the current user
    clearUser(state) {
      state.user = null;
    },
  },
});

// Export actions for components to dispatch
export const { setUser, clearUser } = authSlice.actions;

// Export reducer for store integration
export default authSlice.reducer;
