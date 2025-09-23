'use client';

import { signOut } from 'next-auth/react';
import { destroyCookie } from 'nookies';
import Button from '../button';

const handleClickSignOut = () => {
  destroyCookie(undefined, 'accessToken');
  signOut({ callbackUrl: '/' });
};

const SignOutButton = () => {
  return (
    <Button onClick={() => handleClickSignOut()} variant='danger'>
      Sair
    </Button>
  );
};

export default SignOutButton;
