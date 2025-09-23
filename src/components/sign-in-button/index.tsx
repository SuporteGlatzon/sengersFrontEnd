'use client';

import { signIn, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { PropsWithChildren } from 'react';
import Button from '../button';

const SignInButton = ({ children }: PropsWithChildren) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/meu-perfil';
  const { data: session } = useSession();

  return (
    <Button
      className='pr-2 pl-8 pt-2 pb-2'
      borderRadius='full'
      variant='secondary'
      onClick={() => signIn('github', { callbackUrl })}
    >
      {children}
    </Button>
  );
};

export default SignInButton;
