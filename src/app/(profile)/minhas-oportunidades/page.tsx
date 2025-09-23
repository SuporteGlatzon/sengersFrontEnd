'use client';

import { api } from '@/app/api/api';
import { OpportunityType } from '@/app/type/opportunity.type';
import { NotFoundBox } from '@/components/not-found';
import Button from '@/components/button';
import { MinhasOportunidadesCard } from '@/components/card/minhas-oportunidades';
import { useEffect, useState } from 'react';
import { parseCookies } from 'nookies';

// Disable Next.js caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function MinhasOportunidadesPage() {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const { accessToken } = parseCookies();

        if (!accessToken) {
          throw new Error(
            'Você precisa estar logado para ver suas oportunidades'
          );
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await api.get(`profile?_t=${timestamp}`);

        if (!response.data) {
          throw new Error('Não foi possível carregar os dados do perfil');
        }

        setProfileData(response.data);
      } catch (err) {
        console.error('Error loading profile data:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className='custom-container flex justify-center items-center py-12'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='custom-container py-8'>
        <NotFoundBox
          title='Erro ao carregar oportunidades'
          text={error.message}
        />
      </div>
    );
  }

  // Extract the opportunities from profileData
  const opportunities = profileData?.opportunities || [];

  // If no opportunities, show empty state
  if (opportunities.length === 0) {
    return (
      <div className='custom-container py-8'>
        <NotFoundBox
          title='Nenhuma oportunidade encontrada'
          text='Você ainda não cadastrou nenhuma oportunidade.'
        />
        <div className='mt-8 flex justify-center'>
          <Button
            href='/criar-oportunidade'
            variant='primary'
            borderRadius='full'
          >
            Criar Nova Oportunidade
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='custom-container py-8'>
      <h1 className='text-2xl font-bold text-stone-700 mb-6'>
        Minhas Oportunidades
      </h1>

      {/* Display opportunities using your existing component */}
      <div className='custom-container grid grid-cols-1 xl:grid-cols-2 gap-5 w-full mb-10 place-content-start'>
        {opportunities.map((opportunity: OpportunityType) => (
          <MinhasOportunidadesCard
            data={opportunity}
            key={opportunity.id}
            pageUrl='/minhas-oportunidades'
          />
        ))}
      </div>
    </div>
  );
}
