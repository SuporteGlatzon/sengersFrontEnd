import { api } from '@/app/api/api';
import Profile from '@/components/profile/page';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

type Props = {
  params: {
    id: string;
  };
};

async function CandidatoDetalhe({ params }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken')?.value;

  // Redirect unauthenticated users
  if (!token) {
    console.warn('Unauthorized access attempt to profile page');
    redirect('/login');
  }

  // Set Authorization Header for API
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  try {
    const response = await api.get(`/client/${params.id}`);
    const profileData = response?.data;

    if (!profileData || Object.keys(profileData).length <= 1) {
      console.error('Invalid profile data:', profileData);
      return notFound();
    }

    return <Profile person={profileData} showBackbutton />;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return notFound();
  }
}

export const revalidate = 60;

export default CandidatoDetalhe;
