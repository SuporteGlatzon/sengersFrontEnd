import { api } from '@/app/api/api';
import { OpportunityDetail } from '@/components/opportunity-detail';
import { setAuthToken } from '@/utils/set-auth-token';
import { getVersionedImageUrl } from '@/utils/version-image';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  params: {
    id: string;
  };
};

export const revalidate = 60;

export default async function OportunidadesDetalhe({ params }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken');
  if (!token?.value) return;
  setAuthToken(token?.value);

  const response = await api.get(`profile/opportunity/${params.id}`);
  const opportunity = response.data;

  if (!opportunity) return;

  return (
    <div className='flex w-full justify-center flex-col items-center mb-8'>
      <OpportunityDetail
        opportunity={opportunity}
        backButtonHref='/minhas-oportunidades'
        canEdit={true}
      />
      {opportunity.candidates.length > 0 && (
        <div className='flex mt-10'>
          <h3 className='font-bold text-4xl'>
            Candidatos desta{' '}
            <span className='text-secondary'> Oportunidade</span>
          </h3>
        </div>
      )}

      <div className='grid grid-cols-2 gap-5 mt-6 flex-wrap'>
        {opportunity.candidates &&
          opportunity.candidates.map((candidate: any) => {
            return (
              <Link
                href={`/perfil/${candidate.id}`}
                key={candidate.id}
                className='bg-white flex rounded-lg items-center p-4'
              >
                <div className='rounded-lg min-w-[80px] aspect-square bg-slate-100'>
                  {candidate.image && (
                    <Image
                      src={getVersionedImageUrl(candidate.image)}
                      alt={candidate.name}
                      width={80}
                      height={80}
                    />
                  )}
                </div>
                <div className='flex flex-col pl-3'>
                  <span className='text-2xl font-bold text-stone-800'>
                    {candidate.name}
                  </span>
                  <span className='font-bold text-stone-500'>
                    {candidate.phone}
                  </span>
                  <span className='text-stone-400'>{candidate.email}</span>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
