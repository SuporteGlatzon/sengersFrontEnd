'use client';

import { useSearchParams } from 'next/navigation';
import { PropsWithChildren, ReactElement } from 'react';

type Props = {
  provider: 'github' | 'linkedin' | 'google' | 'facebook';
  icon: ReactElement;
  callback?: any;
} & PropsWithChildren;

function SocialButton({ provider, icon, children, callback = false }: Props) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/meu-perfil';

  return (
    <button
      className='text-tone-700 rounded-md border border-t-stone-200 items-center flex gap-5 p-2 my-2 hover:bg-stone-50'
      onClick={() => callback(provider, { callbackUrl })}
    >
      {icon}
      <div className='w-full items-center text-center pr-4'>{children}</div>
    </button>
  );
}

export default SocialButton;
