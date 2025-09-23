'use client';

import { OpportunityType } from '@/app/type/opportunity.type';
import Button from '@/components/button';
import { useState } from 'react';
import { DefaultCard } from '../card/default';

type Props = {
  data: OpportunityType[];
};

export default function OpportunitiesList({ data }: Props) {
  const CARDS_PER_PAGE = 9;

  const [cardsToShow, setCardsToShow] = useState<number>(CARDS_PER_PAGE);

  const handleLoadMore = () => {
    if (cardsToShow < data.length) {
      setCardsToShow((prevValue) => prevValue + CARDS_PER_PAGE);
    }
  };

  const isLoadMoreDisabled = cardsToShow >= data.length;

  return (
    <div className='flex flex-col items-center'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-7 pb-24 w-full max-[600px]:pb-16'>
        {data.map((opportunity, key) => {
          return (
            <DefaultCard
              key={key}
              data={opportunity}
              isOpportunityListPage={true}
            />
          );
        })}
      </div>
      <div className='flex mb-20 max-[600px]:mb-16'>
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
