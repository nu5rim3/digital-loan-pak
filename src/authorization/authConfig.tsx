import { TAuthConfig, TRefreshTokenExpiredEvent } from "react-oauth2-code-pkce"

// export const authConfig: TAuthConfig = {
//   clientId: import.meta.env.VITE_CLIENT_ID,
//   authorizationEndpoint: import.meta.env.VITE_AUTHORIZATION_ENDPOINT,
//   tokenEndpoint: import.meta.env.VITE_TOKEN_ENDPOINT,
//   redirectUri: import.meta.env.VITE_REDIRECT_URI,
//   scope: "openid profile offline_access",
//   logoutEndpoint: import.meta.env.VITE_LOGOUT_ENDPOINT,
//   extraTokenParameters: {
//     client_id: import.meta.env.VITE_CLIENT_ID,
//     grant_type: import.meta.env.VITE_GRANT_TYPE,
//     // "Access-Control-Allow-Origin" : "*" 
//   },
//   onRefreshTokenExpire: (event: TRefreshTokenExpiredEvent) => {
//     localStorage.removeItem('selectedRole')
//     return (
//       window.confirm('Session expired. Refresh page to continue using the site?') &&
//       event.login()
//     )
//   },
//   autoLogin: false,
// }


export const authConfig2: TAuthConfig = {
  clientId: 'ZWwWCTXU5lyTUxjvivnYfiLYhdUa',
  authorizationEndpoint: 'https://pakauthuat.lolc.com.pk/oauth2/authorize',
  tokenEndpoint: 'https://pakauthuat.lolc.com.pk/oauth2/token',
  redirectUri: 'http://localhost:3000/pak-digital-loan/auth',
  scope: "openid",
  storage: "local",
  autoLogin: false,

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


// callback_urls: regexp=(http://localhost:3000/pak-digital-loan/auth|http://localhost:3000|http://localhost:3000/pak-digital-loan/logout)
