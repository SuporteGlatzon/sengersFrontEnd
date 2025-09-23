'use client';
import lupa from '@/assets/lupa-mobile.png';
import { getVersionedImageUrl } from '@/utils/version-image';
import Image, { StaticImageData } from 'next/image';
import { useState } from 'react';
import Button from '../button';

type Props = {
  banner: any;
  callback: any;
  variant?: 'primary';
};

export function CardConnections({
  banner,
  variant = 'primary',
  callback,
}: Props) {
  const cardClasses = `
  max-[600px]:p-[10px] p-20 max-[600px]:rounded-[0] rounded-3xl  text-white relative overflow-hidden h-[560px] max-[600px]:h-[360px] flex align-center
  `;
  const imageContainerClasses = `
    absolute top-0 left-0 w-full h-full
  `;
  const gradientOverlayClasses = `
    absolute top-0 left-0 w-full h-full 
  `;

  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' && window.innerWidth > 600
  );
  const [searchValue, setSearchValue] = useState('');

  return (
    <>
      <div className='p-0'>
        <div className={cardClasses}>
          <div className={imageContainerClasses}>
            <Image
              src={getVersionedImageUrl(banner.image)}
              alt='Description of the image'
              className={`rounded-3xl max-[600px]:max-w-fit max-[600px]:h-full max-[600px]:rounded-none min-[600px]:w-full`}
              style={{ position: 'absolute' }}
              fill={true}
            />
            <div
              className={gradientOverlayClasses}
              style={{
                background: 'linear-gradient(to right, #00413D, transparent)',
              }}
            ></div>
          </div>
          <div className='w-[46%] max-[600px]:w-full relative z-10 flex flex-col max-[600px]:justify-center'>
            <strong className='text-[76px] max-[600px]:text-[40px] mb-[-50px] max-[600px]:mb-[-10px]'>
              {banner.title}
            </strong>
            <strong className='text-[76px] max-[600px]:text-[40px]'>
              {banner.subtitle}
            </strong>
            <h6 className='py-7 text-[19px] max-[600px]:text-[18px]'></h6>
            {isDesktop && (
              <a
                href={banner.button_link}
                className='py-4 px-10 bg-white text-primary text-lg rounded-3xl font-semibold cursor-pointer flex justify-center w-[40%]'
              >
                {banner.button_text}
              </a>
            )}
          </div>
        </div>
      </div>
      {!isDesktop && (
        <div className='p-6 bg-white rounded-2xl gap-5 flex flex-col relative mt-[-50px] mx-5 z-10 items-start mx-'>
          <span className='font-bold text-lg'>
            Busque{' '}
            <span className='text-secondary'>pela melhor oportunidade</span>
          </span>
          <div className='w-full'>
            <div className='w-fit'>
              <span>Oportunidades</span>
              <hr className='border-secondary border-[1px]'></hr>
            </div>
            <input
              type='text'
              placeholder='Digite o que você procura'
              style={{
                background: '#F5F5F4',
              }}
              className='w-full rounded-[50px] h-[50px] pl-[40px] pr-[25px] mt-[20px]'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button
              variant='primary'
              borderRadius='full'
              className='w-full mt-[20px] flex justify-center'
              onClick={() => callback(searchValue)}
            >
              <Image
                src={getVersionedImageUrl(lupa as StaticImageData)}
                alt='Pesquisar'
                width={24}
                height={24}
              />{' '}
              Buscar
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
