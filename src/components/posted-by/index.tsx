import company from '@/assets/company.png';
import { getVersionedImageUrl } from '@/utils/version-image';
import Image from 'next/image';
import Button from '../button';

type Props = {
  data: {
    postedBy: string;
    city: string;
    state: string;
    description: string;
  };
};

function PostedBy({ data }: Props) {
  return (
    <div className='p-[30px] bg-white rounded-2xl flex flex-col gap-5'>
      <strong className='text-stone-400 text-bold'>Postado por</strong>
      <span className='flex gap-3 items-center'>
        <Image
          width={75}
          height={75}
          className='rounded-3xl'
          src={getVersionedImageUrl(company)}
          alt={data.postedBy}
        />
        <div>
          <h3 className='font-extrabold text-[22px] text-stone-700'>
            {data.postedBy}
          </h3>
          <span className='text-stone-400 font-bold'>
            {data.city + `, ${data.state}`}
          </span>
        </div>
      </span>
      <p className='text-stone-400 font-bold line-clamp-3'>
        {data.description}
      </p>
      <Button
        className='px-5 text-bold flex items-center justify-center'
        variant='secondary'
        borderRadius='full'
      >
        Saiba mais
      </Button>
    </div>
  );
}

export default PostedBy;
