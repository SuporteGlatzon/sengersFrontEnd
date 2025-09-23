'use client';

import { api } from '@/app/api/api';
import { HomeProps } from '@/app/type/home.type';
import { OpportunityType } from '@/app/type/opportunity.type';
import { Banner } from '@/components/banner';
import { BookRoom } from '@/components/book-room';
import { CardForBusiness } from '@/components/for-businesses';
import SliderCard from '@/components/slider-card';
import TitleSection from '@/components/title';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export const revalidate = 60; // Revalidate every 60 seconds

export default function Home() {
  const { data: session } = useSession();
  const [homeData, setHomeData] = useState<HomeProps | null>(null);
  const [opportunitiesData, setOpportunitiesData] = useState<OpportunityType[]>(
    []
  );
  const [youBusinessLink, setYouBusinessLink] = useState(
    'http://localhost:3000/login'
  );

useEffect(() => {
  async function fetchData() {
    console.log("Executando fetchData...");
    try {
      const homeResponse = await api.get<HomeProps>('home');
      console.log("Resposta de home:", homeResponse);

      const opportunitiesResponse = await api.get<OpportunityType[]>('opportunity');
      console.log("Resposta de opportunities:", opportunitiesResponse);

      setHomeData(homeResponse.data);
      setOpportunitiesData(opportunitiesResponse.data);
    } catch (error) {
      console.error('Erro dentro do fetchData:', error);
    }
  }

  fetchData();
}, []);


  useEffect(() => {
    if (session) {
      setYouBusinessLink(
        'https://conexoesengenharia.com.br/criar-oportunidade'
      );
    } else {
      setYouBusinessLink('https://conexoesengenharia.com.br/login');
    }
  }, [session]);

  if (!homeData) {
    return <div className='loader'></div>;
  }

  const primaryContent = homeData.associates || [];
  const secondaryContent = homeData.book_rooms || [];

  return (
    <>
      <Banner banners={homeData.banner} />
      <section className='custom-container'>
        <TitleSection
          title=''
          text='Encontre a oportunidade que combina com você'
        />
        {opportunitiesData.length > 0 && (
          <SliderCard buttonStyle='primary' oportunity={opportunitiesData} />
        )}

        {primaryContent.map((content, index) => (
          <BookRoom
            key={`primary-${index}`}
            data={[content]}
            isReverse={index % 2 !== 0}
          />
        ))}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 py-20'>
          {homeData.card?.map((cardItem, index) => (
            <CardForBusiness
              key={index}
              variant={index % 2 === 0 ? 'primary' : 'secondary'}
              data={{
                miniTitle: cardItem.title || 'Default Title',
                call: cardItem.call || 'Default Call to Action',
                buttonText: cardItem.button_text || 'Learn More',
                link: cardItem.link || '#',
              }}
            />
          ))}
        </div>

        {secondaryContent.map((content, index) => (
          <BookRoom
            key={`secondary-${index}`}
            data={[content]}
            isReverse={index % 2 !== 0}
          />
        ))}
      </section>
    </>
  );
}
