'use client';

import { CompanyType } from '@/app/type/company.type';
import Button from '@/components/button';
import { SmallCard } from '@/components/card/small';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

type Props = {
  companies: CompanyType[];
  buttonStyle: 'primary' | 'secondary';
};

export default function Slider({ companies, buttonStyle }: Props) {
  return (
    <>
      <div className='flex justify-center relative pt-14'>
        <Swiper
          modules={[Navigation]}
          slidesPerView={3}
          spaceBetween={30}
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
              slidesPerView: 2,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 50,
            },
          }}
        >
          {companies.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <SmallCard data={item}></SmallCard>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className='absolute -top-4 right-0 flex gap-5'>
          <button className='prev bg-white flex justify-center items-center rounded-full p-2 text-secondary'>
            <FiChevronLeft size={22} />
          </button>
          <button className='next bg-white flex justify-center items-center rounded-full p-2 text-secondary'>
            <FiChevronRight size={22} />
          </button>
        </div>
      </div>
      <div className='flex justify-center items-center py-8 '>
        <Button variant={buttonStyle} borderRadius='full'>
          Ver Todas
        </Button>
      </div>
    </>
  );
}
