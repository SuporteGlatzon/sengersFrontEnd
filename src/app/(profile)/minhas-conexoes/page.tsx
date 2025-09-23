import { api } from '@/app/api/api';
import MyOpportunities from '@/components/my-opportunities/page';
import { NotFoundBox } from '@/components/not-found';
import { setAuthToken } from '@/utils/set-auth-token';
import { cookies } from 'next/headers';

export const revalidate = 60;

export default async function MinhasConexoes() {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken');
  if (!token?.value) return;
  setAuthToken(token?.value);

  try {
    const response = await api.get('profile');

    console.log(
      'Profile API response:',
      JSON.stringify(response.data, null, 2)
    );

    // First try opportunities_applied, then fall back to candidates
    let appliedOpportunities = response.data?.opportunities_applied || [];

    // If opportunities_applied is empty but candidates exists, use that
    if (
      appliedOpportunities.length === 0 &&
      Array.isArray(response.data?.candidates)
    ) {
      console.log('Using candidates array instead of opportunities_applied');
      appliedOpportunities = response.data.candidates;
    }

    // Debug the opportunities we found
    console.log(`Found ${appliedOpportunities.length} applied opportunities`);

    if (!appliedOpportunities || appliedOpportunities.length === 0) {
      // Try to apply to an opportunity for testing if none exist
      if (process.env.NODE_ENV === 'development') {
        console.log(
          'No opportunities found, attempting to apply to one for testing...'
        );
        try {
          // Try to get an opportunity to apply to
          const opportunitiesResponse = await api.get('opportunities');
          const availableOpportunities = opportunitiesResponse.data.data;

          if (availableOpportunities && availableOpportunities.length > 0) {
            const opportunityId = availableOpportunities[0].id;
            console.log(`Applying to opportunity ${opportunityId} for testing`);

            await api.post(`profile/opportunity/${opportunityId}/associate`);
            console.log('Successfully applied to opportunity for testing');

            // Refetch the profile to get updated data
            const updatedResponse = await api.get('profile');
            appliedOpportunities =
              updatedResponse.data?.opportunities_applied ||
              updatedResponse.data?.candidates ||
              [];
          }
        } catch (applyError) {
          console.error('Error applying to test opportunity:', applyError);
        }
      }

      // If still no opportunities, show the empty state
      if (!appliedOpportunities || appliedOpportunities.length === 0) {
        return (
          <NotFoundBox
            title='Ops!'
            text='Você ainda não tem nenhuma conexão efetuada.'
          />
        );
      }
    }

    return (
      <MyOpportunities
        opportunities={appliedOpportunities}
        pageUrl='/minhas-conexoes'
      />
    );
  } catch (error) {
    console.error('Error fetching connections:', error);
    return (
      <NotFoundBox
        title='Erro!'
        text='Não foi possível carregar suas conexões. Tente novamente mais tarde.'
      />
    );
  }
}
