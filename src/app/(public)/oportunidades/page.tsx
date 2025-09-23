import { City, State } from '@/app/type/locale.type';
import { OccupationArea } from '@/app/type/occupation-area.type';
import { OpportunityKind } from '@/app/type/opportunity-type.type';
import { OpportunityType } from '@/app/type/opportunity.type';
import FilterOpportunities from '@/components/filter-opportunities';
import OpportunitiesList from '@/components/opportunities-list';
import TitleSection from '@/components/title';
import { api } from '../../api/api';

type Props = {
  searchParams: {
    estado: string;
    cidade: string;
    areaDeOcupacao: string;
    tipoDeOportunidade: string;
    busca: string;
  };
};

export const revalidate = 60;

export default async function Oportunidades({ searchParams }: Props) {
  const { estado, cidade, areaDeOcupacao, tipoDeOportunidade, busca } =
    searchParams;

  const searchTerm = busca ? `&search=${busca}` : '';
  const stateParams = estado ? `&state_id=${estado}` : '';
  const cityParams = cidade ? `&city_id=${cidade}` : '';
  const occupationAreaParams = areaDeOcupacao
    ? `&occupation_area_id=${areaDeOcupacao}`
    : '';

  const opportunityTipeParams = tipoDeOportunidade
    ? `&opportunity_type_id=${tipoDeOportunidade}`
    : '';

  const opportunities = await api.get<OpportunityType[]>(
    `opportunity?${stateParams}${cityParams}${occupationAreaParams}${opportunityTipeParams}${searchTerm}`
  );

  const opportunitiesType = await api.get<OpportunityKind[]>(
    'opportunity-type'
  );
  const occupationAreas = await api.get<OccupationArea[]>('occupation-area');

  const stateFilterUrl = estado
    ? `city/${estado}?whereHas=opportunity`
    : 'city';
  const states = await api.get<State[]>('state?whereHas=opportunity');
  const cities = estado ? await api.get<City[]>(stateFilterUrl) : { data: [] };

  return (
    <section>
      <div className='custom-container'>
        {busca ? (
          <TitleSection
            title='Encontre a oportunidade que combina com você'
            text={`Você buscou por: "${busca}"`}
          />
        ) : (
          <TitleSection
            title='Encontre a oportunidade que combina com você'
            text='Nossas oportunidades'
          />
        )}

        <div className='bg-white rounded-2xl p-4 md:p-8 mt-8'>
          <FilterOpportunities
            states={states.data}
            cities={cities.data}
            opportunitiesType={opportunitiesType.data}
            occupationAreas={occupationAreas.data}
          />
        </div>
        {opportunities.data.length < 1 && (
          <div className='pb-4 bg-white rounded-2xl text-center my-10 py-8'>
            <strong className='text-lg md:text-4xl text-stone-800 font-bold inline-block'>
              Ops!
            </strong>
            <p className='text-sm md:text-lg text-stone-400 mt-5'>
              Não econtramos uma oportunidade com os filtros aplicados. Tente
              limpar os filtros e fazer outra busca.
            </p>
          </div>
        )}
        {opportunities.data && <OpportunitiesList data={opportunities.data} />}
      </div>
    </section>
  );
}
