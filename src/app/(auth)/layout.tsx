import { Logo } from '@/components/logo';
import { PropsWithChildren } from 'react';

export default function SignInLayout({ children }: PropsWithChildren) {
  return (
    <section className='h-full flex w-full mt-10 md:-mt-10 md:items-center justify-center bg-stone-100'>
      <div className='flex items-center flex-col px-4'>
        <Logo />
        <div className='bg-white rounded-md p-14 mt-8 md:w-[440px]'>
          {children}
        </div>
      </div>
    </section>
  );
}
