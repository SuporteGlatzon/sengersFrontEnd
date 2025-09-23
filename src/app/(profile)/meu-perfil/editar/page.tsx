export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { api } from '@/app/api/api';
import EditProfile from '@/components/editProfile/page';
import { setAuthToken } from '@/utils/set-auth-token';
import { cookies } from 'next/headers';

export default async function EditProfilePage() {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken');
  if (!token?.value) return;
  setAuthToken(token?.value);
  const response = await api.get('profile');
  const person = response.data;
  if (!person) return;

  const stateDefault = {
    id: '0',
    title: 'Estado não informado',
    value: 'Estado não informado',
    label: 'Estado não informado',
  };
  const cityDefault = {
    id: '0',
    title: 'Cidade não informada',
    value: 'Cidade não informada',
    label: 'Cidade não informada',
  };

  const personWithLocalInfos = {
    ...person,
    state: person.state || stateDefault,
    city: person.city || cityDefault,
  };
  return <EditProfile person={personWithLocalInfos} />;
}
