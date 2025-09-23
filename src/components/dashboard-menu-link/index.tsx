'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { BsArrowRight } from 'react-icons/bs';

type Props = {
  page: string;
  icon: React.ReactNode;
} & PropsWithChildren;

export const DashboardMenuLink = ({ page, icon, children }: Props) => {
  const pathname = usePathname();
  return (
    <Link href={page} className='w-full'>
      <li
        data-current={pathname.includes(page)}
        className='
          flex
          gap-5
          p-4
          items-center
          hover:bg-secondary
          hover:text-white
          w-full
          rounded-2xl
          h-[90px]
          data-[current=true]:bg-secondary
          data-[current=true]:text-white
        '
      >
        {icon}
        <strong className='flex-1 text-[18px]'>{children}</strong>
        <BsArrowRight />
      </li>
    </Link>
  );
};
