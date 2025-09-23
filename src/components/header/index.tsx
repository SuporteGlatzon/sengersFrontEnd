'use client';

import hamburguer from '@/assets/hamburguer.png';
import lupa from '@/assets/lupa.png';
import { getVersionedImageUrl } from '@/utils/version-image';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import { BsArrowRight } from 'react-icons/bs';
import { MdWorkOutline } from 'react-icons/md';
import Skeleton from 'react-loading-skeleton';
import Button from '../button';
import { Logo } from '../logo';
import SignOutButton from '../sign-out-button';

export function Header() {
  const { data: session, status } = useSession();
  const [searchValue, setSearchValue] = useState('');
  const isLoading = status === 'loading';
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    router.push(`oportunidades?busca=${searchValue}`);
  };

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => !prev);
  };

  function AuthenticatedMenu() {
    return (
      <>
        <li>
          <Link
            href={'/oportunidades'}
            className='font-semibold hover:text-secondary p-2'
          >
            Oportunidades
          </Link>
        </li>
        <li>
          <Link
            href={'/criar-oportunidade'}
            className='font-semibold hover:text-secondary p-2'
          >
            Criar Oportunidade
          </Link>
        </li>
        <li className='relative group'>
          <button className='flex items-center space-x-2'>
            {session?.user?.image ? (
              <Image
                src={getVersionedImageUrl(session.user.image)}
                alt={session.user.name || 'Imagem de perfil'}
                className='rounded-full bg-white w-8 h-8 border border-white'
                width={32}
                height={32}
              />
            ) : (
              <AiOutlineUser className='rounded-full bg-white w-8 h-8 text-stone-600 p-1' />
            )}
          </button>
          <ul className='absolute right-0 pt-2 bg-white shadow-md rounded-md w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-10'>
            <li>
              <Link
                href='/meu-perfil'
                className='block px-4 py-2 hover:bg-gray-100 font-semibold text-sm'
              >
                Meu Perfil
              </Link>
              <Link
                href='/minhas-conexoes'
                className='block px-4 py-2 hover:bg-gray-100 font-semibold text-sm'
              >
                Minhas conexões
              </Link>
              <Link
                href='/minhas-oportunidades'
                className='block px-4 py-2 hover:bg-gray-100 font-semibold text-sm'
              >
                Minhas oportunidades
              </Link>
            </li>
            <li>
              <SignOutButton />
            </li>
          </ul>
        </li>
      </>
    );
  }

  function UnAuthenticatedMenu() {
    const saveCallbackUrl = () => {
      const currentUrl = window.location.pathname + window.location.search;
      localStorage.setItem('callbackUrl', currentUrl);
    };

    return (
      <>
        <li>
          <Link
            href={'/oportunidades'}
            className='font-semibold hover:text-secondary p-2'
          >
            Oportunidades
          </Link>
        </li>
        <li>
          <Link
            href={'/login'}
            onClick={saveCallbackUrl}
            className='font-semibold hover:text-secondary p-2'
          >
            Cadastre-se
          </Link>
        </li>
        <li>
          <Link href={'/login'} onClick={saveCallbackUrl}>
            <Button
              className='pr-2 pl-8 pt-2 pb-2'
              borderRadius='full'
              variant='secondary'
            >
              Entrar
              <AiOutlineUser className='rounded-full bg-white w-8 h-8 text-stone-600 p-1' />
            </Button>
          </Link>
        </li>
      </>
    );
  }

  function LoadingMenu() {
    return (
      <>
        <li>
          <Skeleton className='h-5 w-20' />
        </li>
        <li>
          <Skeleton className='h-10 w-40 rounded-full' />
        </li>
      </>
    );
  }

  function ActionsMenu() {
    if (isLoading) return <LoadingMenu />;

    if (session) return <AuthenticatedMenu />;

    return <UnAuthenticatedMenu />;
  }

  return (
    <>
      <header className='w-full py-4 bg-white mb-5 hidden sm:block'>
        <div className='custom-container flex items-center'>
          <div className='w-4/12'>
            <Logo />
          </div>

          <div className='w-4/12 flex justify-center'>
            <nav className='flex-1 flex relative'>
              <form
                className='relative w-[100%]'
                onSubmit={(e) => handleSearchSubmit(e)}
              >
                <input
                  type='text'
                  placeholder='Digite o que você procura'
                  style={{
                    background: '#F5F5F4',
                  }}
                  className='w-[100%] rounded-[50px] h-[50px] pl-[40px] pr-[25px]'
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button
                  type='submit'
                  className='absolute inset-y-0 right-22 flex items-center pl-3 right-[15px]'
                  style={{ zIndex: 10 }}
                >
                  <Image
                    src={getVersionedImageUrl(lupa)}
                    alt='Lupa de pesquisa'
                    width={22}
                    height={22}
                  />
                </button>
              </form>
            </nav>
          </div>

          <div className='w-4/12 flex justify-end'>
            <nav>
              <ul className='flex items-center gap-1'>
                <ActionsMenu />
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <header
        className={`w-full py-4 bg-white ${
          isOpen ? 'h-full' : 'h-[88px]'
        } block sm:hidden`}
      >
        <div className='custom-container flex justify-between items-center'>
          <div onClick={toggleMenu}>
            <Image src={hamburguer} alt='' />
          </div>
          <div>
            <Logo />
          </div>
          <div>
            <Link href={'/meu-perfil'}>
              <AiOutlineUser className='rounded-full bg-secondary w-8 h-8 text-white p-[8px]' />
            </Link>
          </div>
        </div>
        <div className={`${isOpen ? 'open' : 'hidden'} h-full`}>
          <div className='p-[40px]'>
            <Link
              href='/oportunidades'
              className='text-[28px] font-semibold text-stone-700'
            >
              Oportunidades
            </Link>
          </div>
          <hr className='mx-[5px]'></hr>

          <ul
            className='custom-box flex flex-col'
            style={{ alignItems: 'baseline' }}
          >
            <Link href='/meu-perfil' className='w-full'>
              <li className='flex gap-5 p-4 items-center hover:bg-secondary hover:text-white w-full rounded-2xl h-[90px]'>
                <AiOutlineUser className='rounded-full bg-white w-8 h-8 text-stone-600 p-1' />
                <strong className='flex-1 text-[18px]'>Meu Perfil</strong>
                <BsArrowRight />
              </li>
            </Link>

            <Link href='/minhas-conexoes' className='w-full'>
              <li className='flex gap-5 p-4 items-center hover:bg-secondary hover:text-white w-full rounded-2xl h-[90px]'>
                <MdWorkOutline className='rounded-full bg-white w-8 h-8 text-stone-600 p-1' />
                <strong className='flex-1 text-[18px]'>Minhas conexões</strong>
                <BsArrowRight />
              </li>
            </Link>

            <Link href='/minhas-oportunidades' className='w-full'>
              <li className='flex gap-5 p-4 items-center hover:bg-secondary hover:text-white w-full rounded-2xl h-[90px]'>
                <MdWorkOutline className='rounded-full bg-white w-8 h-8 text-stone-600 p-1' />
                <strong className='flex-1 text-[18px]'>
                  Minhas oportunidades
                </strong>
                <BsArrowRight />
              </li>
            </Link>
          </ul>
        </div>
      </header>
    </>
  );
}
