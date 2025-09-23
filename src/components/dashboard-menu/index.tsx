'use client';

import { getVersionedImageUrl } from '@/utils/version-image';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineUser } from 'react-icons/ai';
import { MdWorkOutline } from 'react-icons/md';
import Button from '../button';
import { DashboardMenuLink } from '../dashboard-menu-link';

type Props = {
  person: {
    name: string;
    email: string;
  };
};

export function DashboardMenu({ person }: Props) {
  const { data: session, status } = useSession();

  if (status === 'loading') return null;

  const avatarSrc = session?.user?.image
    ? getVersionedImageUrl(session.user.image)
    : 'https://cdn-icons-png.flaticon.com/512/266/266033.png';

  return (
    <div>
      <div className='p-8 bg-white rounded-2xl flex items-center gap-5'>
        <Image
          src={avatarSrc}
          alt={session?.user?.name || person.name}
          width={100}
          height={100}
          className='rounded-full border-2'
        />
        <div className='flex flex-col'>
          <span className='text-2xl font-bold text-stone-800'>
            {person.name}
          </span>
          <span className='text-stone-500 font-semibold'>{person.email}</span>
        </div>
      </div>

      <div className='mt-5'>
        <ul className='flex flex-col gap-2'>
          <DashboardMenuLink
            page='/meu-perfil'
            icon={
              <AiOutlineUser className='w-8 h-8 p-1 text-stone-600 bg-white rounded-full' />
            }
          >
            Meu Perfil
          </DashboardMenuLink>

          <DashboardMenuLink
            page='/minhas-conexoes'
            icon={
              <MdWorkOutline className='w-8 h-8 p-1 text-stone-600 bg-white rounded-full' />
            }
          >
            Minhas conexões
          </DashboardMenuLink>

          <DashboardMenuLink
            page='/minhas-oportunidades'
            icon={
              <MdWorkOutline className='w-8 h-8 p-1 text-stone-600 bg-white rounded-full' />
            }
          >
            Minhas oportunidades
          </DashboardMenuLink>

          <li>
            <Link href='/criar-oportunidade'>
              <Button
                variant='primary'
                borderRadius='full'
                className='w-full py-4'
              >
                + Adicionar oportunidade
              </Button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
