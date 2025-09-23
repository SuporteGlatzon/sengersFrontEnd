import { api } from '@/app/api/api';
import { OpportunityProps } from '@/app/type/opportunity.type';
import Button from '@/components/button';
import ModalMyOpportunity from '@/components/modal-my-opportunity';
import getDate from '@/utils/date';
import { setAuthToken } from '@/utils/set-auth-token';
import { getVersionedImageUrl } from '@/utils/version-image';
import { cookies } from 'next/headers';

import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type Props = {
  params: {
    id: string;
  };
};

export const revalidate = 60;

export default async function OportunidadeDetalhe({ params }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken')?.value;

  // Redirect unauthenticated users to the login page
  if (!token) {
    redirect(`/login?callbackUrl=/oportunidades/${params.id}`);
  }

  // Set Authorization Header for API requests
  setAuthToken(token);

  let opportunity: OpportunityProps['data'] | null = null;

  try {
    const response = await api.get<OpportunityProps>(
      `opportunity/${params.id}`
    );
    opportunity = response.data;
  } catch (error) {
    console.error('Error fetching opportunity data:', error);
    redirect('/404'); // Redirect to 404 if the opportunity data is not found or invalid
  }

  if (!opportunity) {
    console.error('No opportunity data available');
    redirect('/404'); // Handle missing data more gracefully
  }

  // Fetch authenticated user's profile
  let person = null;
  try {
    const response = await api.get('profile');
    person = response?.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
  }

  const profileId = opportunity?.published_by?.id;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://conexoesengenharia.com.br';
  const profileUrl = profileId ? `${baseUrl}/perfil/${profileId}` : null;

  if (!profileUrl) {
    console.error('Invalid Profile URL:', { baseUrl, profileId });
    return null;
  }

  return (
    <div className='custom-container mb-10 md:flex flex-row justify-between'>
      <div className='bg-white md:w-3/4 flex flex-col p-4 md:p-6 border-white border-4 rounded-2xl'>
        <span className='text-stone-400 text-sm'>
          Postado em {getDate(opportunity.date)}
        </span>
        <strong className='text-4xl text-stone-800 font-bold'>
          {opportunity.title}
        </strong>
        <h2 className='font-bold text-2xl text-stone-700'>
          {opportunity.company}
        </h2>
        <span className='text-stone-400 text-xl font-medium mt-2'>
          {opportunity.city?.title || 'Cidade desconhecida'},{' '}
          {opportunity.state?.letter || 'Estado desconhecido'}
        </span>
        <span className='text-stone-600 text-xl font-semibold mt-2'>
          Salário: {opportunity.salary || 'Não informado'}
        </span>
        <div className='flex flex-row'>
          <div className='bg-gray-200 w-fit pt-1 pb-1 pl-6 pr-6 mr-6 mt-6 mb-6'>
            <span className='font-medium text-base text-stone-700'>
              {opportunity.occupation_area?.title || 'Área não especificada'}
            </span>
          </div>
          <div className='bg-gray-200 w-fit pt-1 pb-1 pl-6 pr-6 mr-6 mt-6 mb-6'>
            <span className='font-medium text-base text-stone-700'>
              {opportunity.type?.title || 'Tipo não especificado'}
            </span>
          </div>
        </div>
        {opportunity.published_by?.id.toString() !== person?.id.toString() && (
          <div className='flex py-4'>
            <ModalMyOpportunity opportunity={opportunity} />
          </div>
        )}

        <div className='flex flex-col pt-10'>
          <div
            dangerouslySetInnerHTML={{
              __html:
                opportunity.full_description ||
                '<p>Descrição não disponível</p>',
            }}
          />
        </div>
      </div>
      <div className='flex flex-col p-6 bg-white border-white border-4 rounded-2xl w-2/5 ml-10 max-h-[335px] overflow-hidden justify-between max-[600px]:p-[10px] max-[600px]:w-full max-[600px]:ml-[0px] max-[600px]:mt-[20px]'>
        <span className='text-stone-400 text-sm mb-5'>Postado por</span>
        <div className='flex flex-row'>
          {opportunity.published_by?.image && (
            <Image
              src={getVersionedImageUrl(opportunity.published_by?.image)}
              alt='Imagem da pessoa que postou a vaga'
              className='object-contain rounded-2xl'
              width={70}
              height={70}
            />
          )}
          <div className='flex flex-col pl-3'>
            <span className='text-[22px] font-bold text-stone-800'>
              {opportunity?.published_by?.name || 'Anônimo'}
            </span>
            {opportunity?.published_by?.city && (
              <span className='text-stone-400 text-[18px] font-bold'>
                {opportunity.published_by.city?.title || 'Cidade desconhecida'},{' '}
                {opportunity.published_by.state?.letter ||
                  'Estado desconhecido'}
              </span>
            )}
          </div>
        </div>
        <div className='pt-4'>
          <span
            dangerouslySetInnerHTML={{
              __html:
                opportunity?.published_by?.description ||
                '<p>Descrição não disponível</p>',
            }}
            className='text-stone-400 text-base font-medium overflow-hidden ellipsis'
          />
        </div>
        <Link href={profileUrl} prefetch={false}>
          <Button
            variant='secondary'
            borderRadius='full'
            className='mt-5 flex justify-center w-full'
          >
            Saiba mais
          </Button>
        </Link>
      </div>
    </div>
  );
}
