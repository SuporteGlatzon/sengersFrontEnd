'use server';

import { cookies } from 'next/headers';

async function destroyAuthCookie(name: string) {
  return cookies().set({
    name: name,
    value: '',
    expires: new Date(),
    path: '/',
  });
}

export default destroyAuthCookie;
