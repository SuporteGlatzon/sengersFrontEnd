'use client';
import { BannerProps } from '@/app/type/banner.type';
import { getVersionedImageUrl } from '@/utils/version-image';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Button from '../button';

type Props = {
  banners: BannerProps[];
};

export const Banner = ({ banners }: Props) => {
  return (
    <div className='custom-container'>
      <Swiper
        modules={[Navigation, EffectFade, Autoplay]}
        slidesPerView={1}
        spaceBetween={30}
        effect='fade'
        loop={true}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: '.prev',
          nextEl: '.next',
          disabledClass: 'swiper-button-disabled opacity-60',
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 1,
            spaceBetween: 50,
          },
        }}
      >
        {banners.map((banner, index) => {
          return (
            <SwiperSlide key={index} className='py-4'>
              <div className='relative rounded-2xl md:rounded-[42px] overflow-hidden'>
                <Image
                  src={getVersionedImageUrl(banner.image)}
                  width={1920}
                  height={1080}
                  alt={banner.title}
                  className='aspect-[9/16] md:aspect-square lg:aspect-[1280/570] object-cover rounded-lg overflow-hidden'
                />
                <div className='absolute z-50 bottom-0 left-0 h-full w-full text-white p-8 md:p-20 flex justify-end flex-col'>
                  <div className='max-w-xl flex flex-col gap-5'>
                    <h1 className='text-2xl lg:text-7xl font-bold'>
                      {banner.title}
                    </h1>
                    <div className='text-small lg:text-base'>
                      {banner.subtitle}
                    </div>

                    {banner.button_link && banner.button_text && (
                      <Button
                        href={banner.button_link}
                        variant='tertiary'
                        borderRadius='full'
                        className='self-start'
                      >
                        {banner.button_text}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
