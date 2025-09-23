'use client';

import { CompanyType } from '@/app/type/company.type';
import Button from '@/components/button';
import { SmallCard } from '@/components/card/small';
import { useState } from 'react';

type Props = {
  data: CompanyType;
};

function CompaniesList({ data }: Props) {
  const allCards = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17];
  const CARDS_PER_PAGE = 9;

  const [cardsToShow, setCardsToShow] = useState<number>(CARDS_PER_PAGE);

  const handleLoadMore = () => {
    if (cardsToShow < allCards.length) {
      setCardsToShow((prevValue) => prevValue + CARDS_PER_PAGE);
    }
  };

  const isLoadMoreDisabled = cardsToShow >= allCards.length;

  return (
    <div className='flex flex-col items-center '>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-7 pb-24 w-full'>
        {allCards.slice(0, cardsToShow).map((index) => {
          return <SmallCard key={index} data={data} />;
        })}
      </div>
      <div className='flex'>
        {!isLoadMoreDisabled && (
          <Button
            variant='primary'
            borderRadius='full'
            onClick={handleLoadMore}
          >
            Carregar mais
          </Button>
        )}
      </div>
    </div>
  );
}

export default CompaniesList;
