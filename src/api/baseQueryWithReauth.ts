import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { customBaseQuery } from './customBaseQuery';
import { setTokens, clearAuth } from '../features/auth/authSlice';

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  console.log('🔸 [baseQueryWithReauth] Sending request:', args);

  let result = await customBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.warn('⚠️ [baseQueryWithReauth] 401 -> trying to refresh ...');

    const refreshResult = await customBaseQuery(
      { url: '/auth/refresh', method: 'POST' },
      api,
      extraOptions
    );
    console.log('🔸 [baseQueryWithReauth] Refresh result:', refreshResult);

    if (refreshResult.data) {
      const newAccessToken = (refreshResult.data as any).accessToken;
      if (newAccessToken) {
        api.dispatch(setTokens({ accessToken: newAccessToken }));
        console.log('✅ [baseQueryWithReauth] Token refreshed. Retrying original request.');
        result = await customBaseQuery(args, api, extraOptions);
      } else {
        console.error('❌ [baseQueryWithReauth] No accessToken in refresh response');
        api.dispatch(clearAuth());
      }
    } else {
      console.error('❌ [baseQueryWithReauth] Refresh failed. Logging out.');
      api.dispatch(clearAuth());
    }
  }

  console.log('🔸 [baseQueryWithReauth] Final result:', result);
  return result;
};
