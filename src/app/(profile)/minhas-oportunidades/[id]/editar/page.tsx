import { api } from '@/app/api/api';
import EditOpportunity from '@/components/editOpportunity/page';
import { setAuthToken } from '@/utils/set-auth-token';
import { cookies } from 'next/headers';

type Props = {
  params: {
    id: string;
  };
};

export const revalidate = 60;

export default async function EditOpportunityPage({ params }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken');
  if (!token?.value) return;
  setAuthToken(token?.value);

  const response = await api.get(`profile/opportunity/${params.id}`);
  const opportunity = response.data;

  if (!opportunity) return;

  return <EditOpportunity opportunity={opportunity} />;
}
