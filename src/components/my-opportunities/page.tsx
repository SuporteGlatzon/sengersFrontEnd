'use client';

import { OpportunityType } from '@/app/type/opportunity.type';
import { MinhasOportunidadesCard } from '../card/minhas-oportunidades';

type Props = {
  opportunities: OpportunityType[];
  pageUrl: string;
};

export default function MyOpportunities({ opportunities, pageUrl }: Props) {
  console.log('MyOpportunities component received:', {
    opportunitiesCount: opportunities?.length,
    firstOpportunity: opportunities?.[0],
    pageUrl,
  });
  return (
    <div className='custom-container grid grid-cols-1 xl:grid-cols-2 gap-5 w-full mb-10 place-content-start'>
      {opportunities.map((opportunity: OpportunityType) => {
        return (
          <MinhasOportunidadesCard
            data={opportunity}
            key={opportunity.id}
            pageUrl={pageUrl}
          />
        );
      })}
    </div>
  );
}
