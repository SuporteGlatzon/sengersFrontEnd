'use client';
import { LogoWhite } from '@/components/logo/white';
import { useSettings } from '@/hooks/useSettings';
import Link from 'next/link';
import { LogoQodde } from '../logo/logo-qodde';
import { LogoSenge } from '../logo/logo-senge';

const menus = [
  {
    name: 'Oportunidades',
    link: '/oportunidades',
  },
  {
    name: 'Cadastre-se',
    link: '/login',
    onClick: () => saveCallbackUrl(),
  },
  {
    name: 'Entrar',
    link: '/login',
    onClick: () => saveCallbackUrl(),
  },
  {
    name: 'SENGE RS',
    link: 'https://senge.org.br/',
  },
];

const saveCallbackUrl = () => {
  const currentUrl = window.location.pathname + window.location.search;
  localStorage.setItem('callbackUrl', currentUrl);
};

export function Footer() {
  const settings = useSettings();

  const address = settings.find((item) => item.key === 'address')?.value || '';
  const phone = settings.find((item) => item.key === 'phone')?.value || '';
  const email = settings.find((item) => item.key === 'email')?.value || '';

  return (
    <footer className='w-full pt-10 bg-primary text-white mt-5'>
      <div className='custom-container flex pb-5 flex-col md:flex-row md:justify-between'>
        <div className='flex flex-col justify-center'>
          <div className='md:w-3/12 flex justify-center md:justify-normal'>
            <LogoWhite />
          </div>
          <div className='flex gap-5 list-none pt-10 pb-12 w-72 md:w-full md:pb-24 justify-center flex-wrap max-[600px]:w-[80%] max-[600px]:m-auto'>
            {menus.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.link}
                  className='font-semibold text-white hover:text-secondary max-[600px]:font-normal max-[600px]:text-[15px]'
                  onClick={() => {
                    if (item.name === 'Cadastre-se' || item.name === 'Entrar') {
                      saveCallbackUrl();
                    }
                  }}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </div>
        </div>
        <div className='flex flex-col items-center md:items-end'>
          <a href='https://senge.org.br' target='_blank'>
            <LogoSenge />
          </a>
          <span className='text-sm pt-12 flex flex-col gap-3 text-white w-72'>
            <p className='text-center md:text-end'>{address}</p>
            <span className='text-center md:text-end'>
              {phone} - <a href={`mailto: ${email}`}>{email}</a>
            </span>
          </span>
        </div>
      </div>
      <div className='custom-container'>
        <div className='border-t border-t-dark-primary flex items-center justify-between py-7 flex-col md:flex-row gap-5'>
          <div className='flex gap-3 flex-1'>
            <Link
              href={'/termos-de-uso'}
              target='_blank'
              className={`font-normal text-white text-sm hover:border-b hover:border-b-white`}
            >
              Termos de uso
            </Link>
            <Link
              href={'/politica-de-privacidade'}
              target='_blank'
              className={`font-normal text-white text-sm hover:border-b hover:border-b-white`}
            >
              Política de Privacidade
            </Link>
          </div>
          <div className='flex-1 flex justify-center'>
            © Todos os direitos reservados.
          </div>
          <div className='flex-1 flex justify-end'>
            <LogoQodde />
          </div>
        </div>
      </div>
    </footer>
  );
}
