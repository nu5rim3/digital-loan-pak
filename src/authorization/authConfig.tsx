import { TAuthConfig, TRefreshTokenExpiredEvent } from "react-oauth2-code-pkce"

export const authConfig2: TAuthConfig = {
  clientId: import.meta.env.VITE_AUTH_CLIENT_ID,
  authorizationEndpoint: import.meta.env.VITE_AUTHORIZATION_ENDPOINT,
  tokenEndpoint: import.meta.env.VITE_TOKEN_ENDPOINT,
  redirectUri: import.meta.env.VITE_REDIRECT_URI,
  scope: "openid",
  storage: "local",
  autoLogin: false,
  decodeToken: true,
  logoutEndpoint: import.meta.env.VITE_LOGOUT_ENDPOINT,

  extraTokenParameters: {
    client_id: 'ZWwWCTXU5lyTUxjvivnYfiLYhdUa',
    grant_type: 'authorization_code',
  },
  onRefreshTokenExpire: (event: TRefreshTokenExpiredEvent) => {
    localStorage.removeItem('selectedRole')
    return (
      window.confirm('Session expired. Refresh page to continue using the site?') &&
      event.login()
    )
  },
};

