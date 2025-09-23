'use client';
import { OpportunityType } from '@/app/type/opportunity.type';

import { api } from '@/app/api/api';
import close from '@/assets/close.png';
import { getVersionedImageUrl } from '@/utils/version-image';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../button';
import { DefaultCard } from '../card/default';
type Props = {
  opportunity: OpportunityType;
  callback: any;
};

export function Modal({ opportunity, callback }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const redirectUrl = `/login?callbackUrl=/oportunidades/${opportunity.id}/?modal=efetuar-candidatura`;

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push(redirectUrl);
    },
  });

  async function confirmCadidate() {
    const { accessToken } = parseCookies();
    setIsLoading(true);
    api.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
    try {
      await api.post(`profile/opportunity/${opportunity.id}/associate`);
      setIsLoading(false);
      toast.success('Candidatura efetuada com sucesso!');
      router.push('/minhas-conexoes');
    } catch (error: any) {
      setIsLoading(false);
      if (error.response && error.response.status === 422) {
        toast.error(
          error.response.data.message ||
            'Usuário já registrado nessa oportunidade'
        );
      } else {
        toast.error('Ops! Tivemos problemas ao efetuar sua candidatura!');
      }
      console.error('Error fetching data:', error);
    }
  }

  return (
    <div className='fixed top-0 left-0 w-full h-full overflow-auto bg-black bg-opacity-50 flex justify-center items-center'>
      <div className='flex flex-col justify-center items-center rounded-[30px] bg-stone-100 w-2/5 max-[600px]:w-[95%]'>
        <div className='bg-white rounded-t-[30px] py-4 px-6 justify-between flex flex-row w-full items-center'>
          <span className='text-xl font-bold'>
            Você confirma sua candidatura para essa vaga?
          </span>
          <Image
            src={getVersionedImageUrl(close)}
            alt='Fechar modal'
            width={19}
            height={20}
            className='h-full w-4'
            onClick={callback}
          />
        </div>
        <div className='bg-white m-6 w-92 rounded-[30px]'>
          <DefaultCard
            data={opportunity}
            key={opportunity.id}
            isModalPage={true}
          />
        </div>
        <div className='bg-white rounded-b-[30px] py-4 px-6 justify-between flex flex-row w-full items-center'>
          <Button variant='secondary' borderRadius='full' onClick={callback}>
            Cancelar
          </Button>
          <Button
            variant='primary'
            borderRadius='full'
            onClick={confirmCadidate}
            disabled={isLoading}
            className='disabled:bg-opacity-50 disabled:pointer-events-none'
          >
            {isLoading && (
              <div className='animate-spin rounded-full h-4 w-4 border-t-transparent border-2 border-white' />
            )}
            Sim
          </Button>
        </div>
      </div>
    </div>
  );
}
