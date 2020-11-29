import { request } from 'umi';
const axios = require("axios");

export async function query() {
  return request<API.CurrentUser[]>('/api/users');
}

export async function queryCurrent() {
  return axios.get("http://localhost:8100/ees/aim/current-user", {
    headers: {
      authorization: `Bearer ${  localStorage.getItem('token')}`
    }
  }).then((res: any) => {
    return {
      username: res.data.username,
      userid: res.data.id
    }
  })
    .catch((err: any) => {
      throw new Error(err);
    });
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}
