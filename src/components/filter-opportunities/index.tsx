'use client';
import { City, State } from '@/app/type/locale.type';
import { OccupationArea } from '@/app/type/occupation-area.type';
import { OpportunityKind } from '@/app/type/opportunity-type.type';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';
import { LoadingScreen } from '../loading';

type Props = {
  states: State[];
  cities?: City[];
  opportunitiesType: OpportunityKind[];
  occupationAreas: OccupationArea[];
};

type WithIdAndTitle = {
  id: number;
  title: string;
};

type WithId = {
  id: number;
};

export default function FilterOpportunities({
  states,
  cities,
  occupationAreas,
  opportunitiesType,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [canShowLoading, setCanShowLoading] = useState<boolean>(false);
  useEffect(() => {
    setCanShowLoading(false);
  }, [searchParams]);

  const selectedStateId = searchParams.get('estado');
  const selectedCityId = searchParams.get('cidade');
  const selectedOpportunityId = searchParams.get('tipoDeOportunidade');
  const selectedOccupationAreaId = searchParams.get('areaDeOcupacao');

  function transformObject<Type extends WithIdAndTitle>(arr: Type[]) {
    return arr.map((item) => ({
      id: item.id,
      value: item.title,
      label: item.title,
    }));
  }

  function getSelectedItemById<T extends WithId>(arr: T[], id: number) {
    if (!id) return;
    return arr.find((item) => item.id === id);
  }

  const selectedStateObject = getSelectedItemById<State>(
    states,
    Number(selectedStateId)
  );

  function transformObjectSingle<Type extends WithIdAndTitle>(item: Type) {
    return {
      id: item.id,
      value: item.title,
      label: item.title,
    };
  }

  const selectedStateObjectFormatted =
    selectedStateObject && transformObjectSingle<State>(selectedStateObject);

  const selectedCityObject = getSelectedItemById<City>(
    cities || [],
    Number(selectedCityId)
  );

  const selectedCityObjectFormatted =
    selectedCityObject && transformObjectSingle<City>(selectedCityObject);

  const selectedOpportunityTypeObject = getSelectedItemById<OpportunityKind>(
    opportunitiesType,
    Number(selectedOpportunityId)
  );

  const selectedOpportunityTypeFormatted =
    selectedOpportunityTypeObject &&
    transformObjectSingle<OpportunityKind>(selectedOpportunityTypeObject);

  const selectedOccupationAreaObject = getSelectedItemById<OpportunityKind>(
    occupationAreas,
    Number(selectedOccupationAreaId)
  );

  const selectedOccupationAreaFormatted =
    selectedOccupationAreaObject &&
    transformObjectSingle<OccupationArea>(selectedOccupationAreaObject);

  const createQueryString = useCallback(
    (name: string, value: string, removeParams: string[] = []) => {
      const params = new URLSearchParams(searchParams.toString());

      removeParams.forEach((param) => {
        params.delete(param);
      });

      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    <div>
      <LoadingScreen isVisible={canShowLoading} />
      <div className='flex justify-between'>
        <h1 className='text-[25px] max-[600px]:text-[21px] font-bold text-stone-800'>
          Filtrar <span className='text-secondary'>oportunidades</span>
        </h1>
        <button
          className='text-red-600 font-bold text-sm  max-[600px]:text-[12px] cursor-pointer'
          onClick={() => router.push('oportunidades')}
        >
          Limpar Filtros
        </button>
      </div>
      <div className='flex gap-5 text-lg font-semibold pt-4 mt-5 border-t-[1px] flex-col md:flex-row'>
        <div className='flex-1 md:w-1/4'>
          <label className='pb-2 block text-[18px] font-semibold text-stone-800'>
            Estado
          </label>
          <Select
            placeholder='Selecione...'
            id='state'
            value={selectedStateObjectFormatted || null}
            options={transformObject<State>(states)}
            onChange={(selectedOption) => {
              setCanShowLoading(true);

              setCanShowLoading(true);
              router.push(
                pathname +
                  '?' +
                  createQueryString('estado', `${selectedOption?.id}`, [
                    'cidade',
                  ])
              );
            }}
          />
        </div>

        <div className='flex-1 md:w-1/4'>
          <label className='pb-2 block text-[18px] font-semibold text-stone-800'>
            Cidade
          </label>
          <Select
            placeholder='Selecione...'
            id='city'
            value={selectedCityObjectFormatted || null}
            isDisabled={!selectedStateId}
            options={cities && transformObject<City>(cities)}
            onChange={(selectedOption) => {
              setCanShowLoading(true);
              router.push(
                pathname +
                  '?' +
                  createQueryString('cidade', `${selectedOption?.id}`)
              );
            }}
          />
        </div>

        <div className='w-full md:w-1/4'>
          <label className='pb-2 block text-[18px] font-semibold text-stone-800'>
            Tipo de oportunidade
          </label>
          <Select
            placeholder='Selecione...'
            value={selectedOpportunityTypeFormatted || null}
            options={transformObject<OpportunityKind>(opportunitiesType)}
            onChange={(selectedOption) => {
              setCanShowLoading(true);
              router.push(
                pathname +
                  '?' +
                  createQueryString(
                    'tipoDeOportunidade',
                    `${selectedOption?.id}`
                  )
              );
            }}
          />
        </div>

        <div className='w-full md:w-1/4'>
          <label className='pb-2 block text-[18px] font-semibold text-stone-800'>
            Área de atuação
          </label>
          <Select
            placeholder='Selecione...'
            value={selectedOccupationAreaFormatted || null}
            options={transformObject<OccupationArea>(occupationAreas)}
            onChange={(selectedOption) => {
              setCanShowLoading(true);
              router.push(
                pathname +
                  '?' +
                  createQueryString('areaDeOcupacao', `${selectedOption?.id}`)
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
