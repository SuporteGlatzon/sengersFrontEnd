'use client';

import Button from '@/components/button';
import { useState } from 'react';
import { GoSearch } from 'react-icons/go';

type Props = {
  data: {
    title: string;
    opportunity: string[];
  };
};

export const SearchOpportunity = ({ data }: Props) => {
  const [selectedItem, setSelectedItem] = useState(data.opportunity[0]);

  return (
    <div className='p-10 bg-white rounded-3xl'>
      <h2 className='text-secondary text-4xl font-black'>
        <span className='text-stone-800'>Busque </span>
        {data.title}
      </h2>
      <div className='flex gap-3 pt-5'>
        {data.opportunity.map((item, index) => {
          return (
            <span
              className={`cursor-pointer text-lg font-black border-b-2 ${
                selectedItem === item
                  ? ' border-secondary'
                  : ' border-stone-300'
              }`}
              onClick={() => setSelectedItem(item)}
              key={index}
            >
              {item}
            </span>
          );
        })}
      </div>
      <div className='flex gap-6 mt-6'>
        <input
          placeholder='Digite o que você procura'
          className='py-4 px-8 bg-stone-100 rounded-full text-stone-700 outline-none w-full text-bold text-xl placeholder-stone-400'
          type='text'
          name='search-opportunity'
        />
        <Button
          className='px-[50px] py-4 text-lg font-bold flex items-center justify-center'
          borderRadius='full'
          variant='primary'
        >
          <GoSearch /> Buscar
        </Button>
      </div>
    </div>
  );
};
