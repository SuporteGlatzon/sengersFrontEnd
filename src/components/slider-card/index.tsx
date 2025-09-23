'use client';

import { OpportunityType } from '@/app/type/opportunity.type';
import Button from '@/components/button';
import { DefaultCard } from '@/components/card/default';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

type Props = {
  oportunity: OpportunityType[];
  buttonStyle: 'primary' | 'secondary';
};

export default function SliderCard({ oportunity, buttonStyle }: Props) {
  return (
    <>
      <div className='block justify-center relative pt-14 max-[600px]:pt-0'>
        <Swiper
          slidesPerView={1.1}
          spaceBetween={20}
          modules={[Navigation]}
          navigation={{
            prevEl: '.prev',
            nextEl: '.next',
            disabledClass: 'swiper-button-disabled opacity-60',
          }}
          breakpoints={{
            768: {
              slidesPerView: 2.2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {oportunity.map((item, index) => {
            return (
              <SwiperSlide key={index} className='swiper-opportunities'>
                <DefaultCard data={item} isHomePage={true} />
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className='absolute -top-4 right-0 flex gap-5 max-[600px]:hidden'>
          <button className='prev bg-white flex justify-center items-center rounded-full p-2 text-secondary'>
            <FiChevronLeft size={22} />
          </button>
          <button className='next bg-white flex justify-center items-center rounded-full p-2 text-secondary'>
            <FiChevronRight size={22} />
          </button>
        </div>
      </div>
      <div className='flex justify-center items-center pt-8 pb-12'>
        <Link href='/oportunidades'>
          <Button variant={buttonStyle} borderRadius='full'>
            Ver Todas
          </Button>
        </Link>
      </div>
    </>
  );
}
