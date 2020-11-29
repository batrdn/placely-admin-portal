const axios = require("axios");

export interface LoginParamsType {
  username: string;
  password: string;
}

export async function login(params: LoginParamsType) {
  const parameters = {username: params.username, password: params.password, tenant: 'master', is2fa: 'false'};
  return axios.post("http://localhost:8100/ees/aim/login", parameters)
    .then((res: any) => {
      const {tokenInfo} = res.data;

      localStorage.setItem('token', tokenInfo.access_token);

      return {
        accessToken: tokenInfo.access_token,
        refreshToken: tokenInfo.refreshToken
      };
    }).catch((err: any) => {
      throw new Error(err);
    });
}

export async function logOut() {
  // return request('/api/login/outLogin');
}
