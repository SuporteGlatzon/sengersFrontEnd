'use client';

import { useRouter } from 'next/navigation';
import { destroyCookie } from 'nookies';
import { useEffect, useState } from 'react';

const ONE_SECOND_TIME = 1000;

export const LoadingRedirect = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown === 0) {
      router.push('/login');
      destroyCookie(undefined, 'accessToken');
      destroyCookie(undefined, 'provider');
    } else {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, ONE_SECOND_TIME);

      return () => clearTimeout(timer);
    }
  }, [countdown, router]);

  return (
    <div className='flex flex-col justify-center items-center h-full w-full py-10 px-4'>
      <div className='animate-spin rounded-full h-16 w-16 border-t-transparent border-2 border-secondary'></div>
      <div className='flex gap-4 flex-col text-center py-4'>
        <strong className='text-lg md:text-4xl text-stone-800 font-bold inline-block'>
          Ops!
        </strong>
        <strong>Você não tem permissão para acessar esta página.</strong>

        <small className='text-sm md:text-lg text-stone-400'>
          Redirecionando para o login em{' '}
          <span className='text-secondary'>{countdown}</span>
        </small>
      </div>
    </div>
  );
};
