import { DashboardMenu } from '@/components/dashboard-menu';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { LoadingRedirect } from '@/components/loading-redirect';
import { setAuthToken } from '@/utils/set-auth-token';
import { cookies } from 'next/headers';
import { PropsWithChildren } from 'react';
import { api } from '../api/api';

export const fetchCache = 'force-no-store';
export default async function ProfileLayout({ children }: PropsWithChildren) {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken');

  if (!token?.value) {
    return (
      <>
        <Header />
        <main className='flex-1'>
          <LoadingRedirect />
        </main>

        <Footer />
      </>
    );
  }

  setAuthToken(token.value);

  let responsePerson;
  try {
    responsePerson = await api.get('profile');
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return (
      <>
        <Header />
        <main className='flex-1'>
          <LoadingRedirect />
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className='flex-1'>
        <div className='custom-container flex gap-5'>
          <div className='w-4/12 hidden md:block'>
            <DashboardMenu person={responsePerson.data} />
          </div>
          <div className='w-full md:w-8/12 flex'>{children}</div>
        </div>
      </main>

      <Footer />
    </>
  );
}
