import Link from 'next/link';
import { ReactElement } from 'react';

type Props = {
  data: {
    site: ReactElement;
    instagram: ReactElement;
    twitter: ReactElement;
    linkedin: ReactElement;
  };
};

type PropsCircle = {
  children: ReactElement;
  link?: string;
};

function CircleIcons({ children }: PropsCircle) {
  return (
    <Link href={'/'} target='_blank'>
      <span className='w-[50px] h-[50px] flex items-center justify-center border border-stone-200 rounded-full'>
        {children}
      </span>
    </Link>
  );
}

function Socialmedias({ data }: Props) {
  return (
    <div className='flex gap-5'>
      <CircleIcons>{data.site}</CircleIcons>
      <CircleIcons>{data.twitter}</CircleIcons>
      <CircleIcons>{data.instagram}</CircleIcons>
      <CircleIcons>{data.linkedin}</CircleIcons>
    </div>
  );
}

export default Socialmedias;
