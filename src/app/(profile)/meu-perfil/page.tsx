import Profile from '@/components/profile/page';
import { setAuthToken } from '@/utils/set-auth-token';
import { cookies } from 'next/headers';
import { api } from '../../api/api';

export const revalidate = 60;

export default async function ProfilePage() {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken');
  if (!token?.value) return;
  setAuthToken(token?.value);
  const response = await api.get('profile');
  const person = response.data;
  if (!person) return;

  // Get local user info (e.g., image) from cookies
  const user = cookieStore.get('user');
  const userParsed = JSON.parse(user?.value || '{}');

  // Provide fallback objects for state and city if they're null
  const stateDefault = { id: '', letter: '', title: 'Estado não informado' };
  const cityDefault = { id: '', title: 'Cidade não informada' };

  const personWithLocalInfos = {
    ...person,
    image: userParsed.image,
    state: person.state || stateDefault,
    city: person.city || cityDefault,
  };

  return <Profile person={personWithLocalInfos} isLoggedProfile={true} />;
}
