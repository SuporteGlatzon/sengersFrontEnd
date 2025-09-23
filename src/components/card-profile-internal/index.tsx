import image from '@/assets/persona.png';
import { getVersionedImageUrl } from '@/utils/version-image';
import Image from 'next/image';
import { ReactElement } from 'react';

type Props = {
  data: {
    image?: ReactElement;
    name: string;
    email: string;
  };
};

function CardCandidateInternal({ data }: Props) {
  return (
    <div className='flex items-center gap-5 bg-white rounded-2xl p-[30px]'>
      <Image
        className='rounded-full'
        src={getVersionedImageUrl(image)}
        alt={data.name}
      />

      <span className='flex justfy-center flex-col font-extrabold'>
        <div className='text-2xl text-stone-800'>{data.name}</div>
        <div className='text-lg text-stone-600'>{data.email}</div>
      </span>
    </div>
  );
}

export default CardCandidateInternal;
