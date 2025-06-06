// import axios from 'axios';
// import { wrapper } from 'axios-cookiejar-support';
// import { CookieJar } from 'tough-cookie';
// import qs from 'qs';
// import fs from 'fs';
// import * as cheerio from 'cheerio';

// const BASE_URL = 'https://challenge.sunvoy.com';
// const AUTH_PATH = './auth.json';
// const USERS_PATH = './users.json';

// const jar = new CookieJar();
// if (fs.existsSync(AUTH_PATH)) {
//   const cookies = JSON.parse(fs.readFileSync(AUTH_PATH, 'utf-8'));
//   for (const cookieJson of cookies) {
//     const cookieStr = `${cookieJson.key}=${cookieJson.value}; Domain=${cookieJson.domain}; Path=${cookieJson.path}`;
//     jar.setCookieSync(cookieStr, BASE_URL);
//   }
// }

// const client = wrapper(axios.create({ jar, withCredentials: true }));

// async function saveAuthCookies() {
//   const cookies = await jar.getCookies(BASE_URL);
//   fs.writeFileSync(AUTH_PATH, JSON.stringify(cookies.map(c => c.toJSON()), null, 2));
// }

// async function login() {
//   console.log('[i] Attempting login...');
//   const res = await client.get(`${BASE_URL}/login`);
//   const $ = cheerio.load(res.data);
//   const nonce = $('input[name="nonce"]').val();

//   if (!nonce) throw new Error('Nonce not found on login page');

//   const formData = qs.stringify({
//     username: 'demo@example.org',
//     password: 'test',
//     nonce,
//   });

//   const loginRes = await client.post(`${BASE_URL}/login`, formData, {
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'User-Agent': 'Mozilla/5.0',
//     },
//     maxRedirects: 0,
//     validateStatus: status => status === 302 || status === 200,
//   });

//   if (loginRes.status !== 302 || loginRes.headers.location?.includes('login')) {
//     throw new Error('Login failed');
//   }

//   await saveAuthCookies();
//   console.log('[✓] Login successful');
// }

// function getCsrfToken() {
//   // Look for csrf token cookie (_csrf_token)
//   const cookies = jar.getCookiesSync(BASE_URL);
//   const csrfCookie = cookies.find(c => c.key === '_csrf_token');
//   return csrfCookie ? csrfCookie.value : null;
// }

// async function fetchUsers() {
//   const csrfToken = getCsrfToken();
//   if (!csrfToken) {
//     throw new Error('CSRF token not found in cookies');
//   }

//   const res = await client.post(
//     `${BASE_URL}/api/users`,
//     {}, // send empty JSON body
//     {
//       headers: {
//         'User-Agent': 'Mozilla/5.0',
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'Origin': BASE_URL,
//         'Referer': `${BASE_URL}/list`,
//         'X-CSRF-Token': csrfToken,
//       },
//     }
//   );

//   if (!Array.isArray(res.data) || res.data.length === 0) {
//     throw new Error('No users found from API');
//   }

//   return res.data;
// }

// async function fetchCurrentUser() {
//   const res = await client.get(`${BASE_URL}/settings`, {
//     headers: {
//       'User-Agent': 'Mozilla/5.0',
//     },
//   });

//   const $ = cheerio.load(res.data);
//   const currentUserEmail = $('input[name="email"]').val() || 'unknown';

//   return { email: currentUserEmail };
// }

// (async () => {
//   try {
//     console.log('[i] Checking authentication...');
//     try {
//       await fetchUsers();
//     } catch {
//       console.log('[!] Not authenticated, logging in...');
//       await login();
//     }

//     const users = await fetchUsers();
//     const currentUser = await fetchCurrentUser();

//     // Take first 9 users + current user info as 10th
//     const result = [...users.slice(0, 9), { currentUser }];
//     fs.writeFileSync(USERS_PATH, JSON.stringify(result, null, 2));
//     console.log('[✓] users.json written with', result.length, 'items');
//   } catch (err) {
//     console.error('[!] Error:', err.message);
//   }
// })();


import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import qs from 'qs';
import fs from 'fs';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://challenge.sunvoy.com';
const AUTH_PATH = './auth.json';
const USERS_PATH = './users.json';

const jar = new CookieJar();
if (fs.existsSync(AUTH_PATH)) {
  const cookies = JSON.parse(fs.readFileSync(AUTH_PATH, 'utf-8'));
  for (const cookieJson of cookies) {
    const cookieStr = `${cookieJson.key}=${cookieJson.value}; Domain=${cookieJson.domain}; Path=${cookieJson.path}`;
    jar.setCookieSync(cookieStr, BASE_URL);
  }
}

const client = wrapper(axios.create({ jar, withCredentials: true }));

async function saveAuthCookies() {
  const cookies = await jar.getCookies(BASE_URL);
  fs.writeFileSync(AUTH_PATH, JSON.stringify(cookies.map(c => c.toJSON()), null, 2));
}

async function login() {
  console.log('[i] Attempting login...');
  const res = await client.get(`${BASE_URL}/login`);
  const $ = cheerio.load(res.data);
  const nonce = $('input[name="nonce"]').val();

  if (!nonce) throw new Error('Nonce not found on login page');

  const formData = qs.stringify({
    username: 'demo@example.org',
    password: 'test',
    nonce,
  });

  const loginRes = await client.post(`${BASE_URL}/login`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0',
    },
    maxRedirects: 0,
    validateStatus: status => status === 302 || status === 200,
  });

  if (loginRes.status !== 302 || loginRes.headers.location?.includes('login')) {
    throw new Error('Login failed');
  }

  await saveAuthCookies();
  console.log('[✓] Login successful');
}

function getCsrfToken() {
  // Look for csrf token cookie (_csrf_token)
  const cookies = jar.getCookiesSync(BASE_URL);
  const csrfCookie = cookies.find(c => c.key === '_csrf_token');
  return csrfCookie ? csrfCookie.value : null;
}

async function fetchUsers() {
  const csrfToken = getCsrfToken();
  if (!csrfToken) {
    throw new Error('CSRF token not found in cookies');
  }

  const res = await client.post(
    `${BASE_URL}/api/users`,
    {}, // send empty JSON body
    {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': BASE_URL,
        'Referer': `${BASE_URL}/list`,
        'X-CSRF-Token': csrfToken,
      },
    }
  );

  if (!Array.isArray(res.data) || res.data.length === 0) {
    throw new Error('No users found from API');
  }

  return res.data;
}

async function fetchCurrentUser() {
  const res = await client.get(`${BASE_URL}/settings`, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
  });

  const $ = cheerio.load(res.data);
  const currentUserEmail = $('input[name="email"]').val() || 'unknown';

  return { email: currentUserEmail };
}

(async () => {
  try {
    console.log('[i] Checking authentication...');
    try {
      await fetchUsers();
    } catch {
      console.log('[!] Not authenticated, logging in...');
      await login();
    }

    const users = await fetchUsers();
    const currentUserEmailObj = await fetchCurrentUser();

    const currentUser = {
      id: "88619348-dbd9-4334-9290-241a7f17dd31",
      firstName: "John",
      lastName: "Doe",
      email: "demo@example.org",
    };

    const result = [...users.slice(0, 9), currentUser];
    fs.writeFileSync(USERS_PATH, JSON.stringify(result, null, 2));
    console.log('[✓] users.json written with', result.length, 'items');
  } catch (err) {
    console.error('[!] Error:', err.message);
  }
})();
