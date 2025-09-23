import { CompanyType } from '@/app/type/company.type';
import { getVersionedImageUrl } from '@/utils/version-image';

import Image from 'next/image';
import Link from 'next/link';
type Props = {
  data: CompanyType;
};

export function SmallCard({ data }: Props) {
  return (
    <Link href='/' className='custom-box-small flex gap-5 group'>
      <figure className='w-20 h-20 bg-stone-400 border border-stone-100 rounded-3xl overflow-hidden'>
        <Image
          src={getVersionedImageUrl(data.image)}
          width={80}
          height={80}
          alt=' '
          className='object-cover'
        ></Image>
      </figure>
      <div className='flex flex-col'>
        <strong className='text-md text-stone-800 group-hover:text-secondary'>
          {data.name}
        </strong>
        <strong className='text-stone-500 font-semibold'>
          {data.city} - {data.state}
        </strong>
        <span className='text-stone-400 font-medium'>{data.segment}</span>
      </div>
    </Link>
  );
}
