import Pill from '@/components/pill';
import Link from 'next/link';
import { AiOutlineUser } from 'react-icons/ai';

type Props = {
  data: any;
  pageUrl?: string;
};

export function MinhasOportunidadesCard({
  data,
  pageUrl = '/oportunidades',
}: Props) {
  // Add debugging
  console.log('Card received data:', data);

  // Remove or modify this check - THIS IS THE KEY ISSUE!
  // Instead of returning null, let's handle missing data properly
  if (!data) return null;

  function showStatus() {
    switch (data.situation) {
      case 'approved':
        return 'Aprovado / Publicada';
      case 'pending':
        return 'Aguardando aprovação';
      case 'no_approved':
        return 'Não aprovada';
      case 'expired':
        return 'Expirada';
      default:
        return 'Candidatura efetuada';
    }
  }

  function showStatusVariant() {
    switch (data.situation) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'no_approved':
        return 'danger';
      case 'expired':
        return 'neutral';
      default:
        return 'success';
    }
  }

  return (
    <Link
      href={`${pageUrl}/${data.id}`}
      className='custom-box-small flex gap-5 group flex-col justify-between'
    >
      <div className='flex w-full'>
        <div className='flex-1 flex flex-col'>
          <strong className='text-[22px] text-stone-700'>
            {data.company || 'Empresa'}
          </strong>
          <strong className='text-stone-400 text-base font-normal'>
            {data.city?.title || data.city_id || 'Cidade'} -{' '}
            {data.state?.title || data.state_id || 'Estado'}
          </strong>
          <div className='py-4 w-full'>
            <Pill variant={showStatusVariant()}>{showStatus()}</Pill>
          </div>
        </div>
        {!!data.candidates?.length && (
          <div className='py-2 px-6 bg-primary text-white flex gap-2 items-center justify-center font-semibold text-lg rounded-full'>
            <AiOutlineUser />
            {data.candidates.length}
          </div>
        )}
      </div>
      <div className='w-full flex flex-col'>
        <strong className='text-2xl text-stone-800 group-hover:text-secondary'>
          {data.title || 'Sem título'}
        </strong>
        <span
          className='text-stone-500 text-base overflow-hidden max-h-[150px] line-clamp-3'
          dangerouslySetInnerHTML={{
            __html: data.description || '',
          }}
        />
      </div>
    </Link>
  );
}
