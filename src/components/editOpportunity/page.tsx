'use client';
import Select from 'react-select';

import { api } from '@/app/api/api';
import Button from '@/components/button';
import JoditEditor from 'jodit-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useRouter } from 'next/navigation';

import CurrencyInput from 'react-currency-input-field';

type Props = {
  opportunity: any;
};

type Option = {
  id: string;
  value: string;
  label: string;
};

const editorConfig = {
  toolbarAdaptive: false,
  showCharsCounter: false,
  showWordsCounter: false,
  showXPathInStatusbar: false,
  askBeforePasteHTML: false,
  defaultActionOnPaste: 'insert_as_text',
  askBeforePasteFromWord: false,
  minHeight: 200,
  minWidth: null,
  buttons:
    'bold,italic,underline,|,align,ul,ol,|,|,font,fontsize,link,|,undo,redo',
  editorCssClass: 'alic',
  placeholder: '',
};

export default function EditOpportunity({ opportunity }: Props) {
  const [states, setStates] = useState();
  const [cities, setCities] = useState();
  const [opportunityType, setOpportunityType] = useState();
  const [occupationArea, setOccupationArea] = useState();
  const [state, setState] = useState<Option | null>(null);
  const [city, setCity] = useState<Option | null>(null);
  const [opportunityTypeError, setOpportunityTypeError] = useState('');
  const [occupationAreaError, setOccupationAreaError] = useState('');
  const [stateError, setStateError] = useState('');
  const [cityError, setCityError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [fullDescriptionError, setFullDescriptionError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [integratorSection, setIntegratorSection] = useState({
    text: '',
    button_text: '',
    button_link: '',
  });
  const [editOpportunity, setEditOpportunity] = useState<any>({
    ...opportunity,
    isOpportunityActive:
      opportunity.status === true ||
      opportunity.status === 't' ||
      opportunity.status === 'TRUE',
  });
  const router = useRouter();

  const style = {
    control: (base: any, state: any) => ({
      ...base,
      borderTopWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderRadius: 0,
      boxShadow: 'none',
      backgroundColor: state.isDisabled ? 'white' : 'white',
    }),
  };

  function transformObject(object: any) {
    return object.map((item: { id: any; title: any }) => ({
      id: item.id,
      value: item.title,
      label: item.title,
    }));
  }

  async function showCity(selectedOption: any) {
    setState(selectedOption);
    try {
      const response = await api.get(`/city/${selectedOption}`);
      const cities = transformObject(response.data);
      setCities(cities);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/state', {});
        const states = transformObject(response.data);
        setStates(states);

        if (
          opportunity.state &&
          opportunity.city &&
          opportunity.occupation_area &&
          opportunity.type
        ) {
          setEditOpportunity({
            ...editOpportunity,
            state: {
              id: opportunity.state.id,
              value: opportunity.state.title,
              label: opportunity.state.title,
            },
            city: {
              id: opportunity.city.id,
              value: opportunity.city.title,
              label: opportunity.city.title,
            },
            type: {
              id: opportunity.type.id,
              value: opportunity.type.title,
              label: opportunity.type.title,
            },
            occupation_area: {
              id: opportunity.occupation_area.id,
              value: opportunity.occupation_area.title,
              label: opportunity.occupation_area.title,
            },
            salary: opportunity.salary
              ? Number(
                  opportunity.salary
                    .replace('R$', '')
                    .replace(/\./g, '')
                    .replace(',', '.')
                )
              : '',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const getOccupationAndOpportunity = async () => {
      try {
        const responseTypes = await api.get('/opportunity-type', {});
        const responseOccupation = await api.get('/occupation-area', {});
        const responseOccupationTransformed = responseOccupation.data.map(
          (item: { id: any; title: any }) => ({
            id: String(item.id),
            value: item.title,
            label: item.title,
          })
        );

        const responseTypesTransformed = responseTypes.data.map(
          (item: { id: any; title: any }) => ({
            id: String(item.id),
            value: item.title,
            label: item.title,
          })
        );

        setOccupationArea(responseOccupationTransformed);
        setOpportunityType(responseTypesTransformed);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchIntegratorSection = async () => {
      try {
        const response = await api.get('/integrator-section');
        const sectionData = response.data;
        setIntegratorSection(sectionData);
      } catch (error) {
        console.error('Error fetching integrator section:', error);
      }
    };

    getOccupationAndOpportunity();
    fetchIntegratorSection();
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opportunity.city.id, opportunity.state.id]);

  function validateForm() {
    const validations = [
      {
        field: editOpportunity.type.label,
        errorSetter: setOpportunityTypeError,
        errorMessage: 'Escolha uma opção',
      },
      {
        field: editOpportunity.occupation_area.label,
        errorSetter: setOccupationAreaError,
        errorMessage: 'Escolha uma opção',
      },
      {
        field: editOpportunity.state.label,
        errorSetter: setStateError,
        errorMessage: 'Escolha um estado',
      },
      {
        field: editOpportunity.city.label,
        errorSetter: setCityError,
        errorMessage: 'Escolha uma cidade',
      },
      {
        field: editOpportunity.description.length === 0,
        errorSetter: setDescriptionError,
        errorMessage: 'Digite uma descrição',
      },
      {
        field:
          editOpportunity.full_description.replace(/<[^>]*>/g, '').length === 0,
        errorSetter: setFullDescriptionError,
        errorMessage: 'Digite uma descrição completa',
      },
    ];

    let hasErrors = false;

    validations.forEach((validation) => {
      if (
        typeof validation.field === 'boolean'
          ? validation.field
          : validation.field.length === 0
      ) {
        validation.errorSetter(validation.errorMessage);
        hasErrors = true;
      }
    });

    setTimeout(() => {
      setCityError('');
      setStateError('');
      setOpportunityTypeError('');
      setOccupationAreaError('');
      setDescriptionError('');
      setFullDescriptionError('');
    }, 5000);

    return !hasErrors;
  }

  async function putRequest(e: any) {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      await api.put(`/profile/opportunity/${editOpportunity.id}`, {
        company: editOpportunity.company,
        title: editOpportunity.title,
        date: editOpportunity.date,
        salary: editOpportunity.salary,
        description: editOpportunity.description,
        full_description: editOpportunity.full_description,
        state_id: Number(editOpportunity.state?.id),
        city_id: Number(editOpportunity.city?.id),
        occupation_area_id: Number(editOpportunity.occupation_area?.id),
        opportunity_type_id: Number(editOpportunity.type?.id),
        status: editOpportunity.isOpportunityActive,
      });
      setIsLoading(false);
      toast.success('Dados salvos com suesso!');
      router.push(`/minhas-oportunidades/${editOpportunity.id}`);
      router.refresh();
    } catch (error) {
      setIsLoading(false);
      toast.error('Ops. Não conseguimos processar sua solicitação');
      console.error('Error fetching data:', error);
    }
  }

  function handleUpdate(
    type: string,
    updatedInfo: any,
    isSelectOrFullDescription: boolean = false,
    isCheckbox: boolean = false,
    isTags: boolean = false
  ) {
    const updatedOpportunity = { ...editOpportunity };
    if (isSelectOrFullDescription) {
      updatedOpportunity[type] = updatedInfo;
    } else if (isCheckbox) {
      updatedOpportunity[type] = updatedInfo.target.checked;
    } else if (isTags) {
      updatedOpportunity[type] = updatedInfo;
    } else if (updatedInfo && updatedInfo.target !== undefined) {
      updatedOpportunity[type] = updatedInfo.target.value;
    } else {
      updatedOpportunity[type] = updatedInfo;
    }
    setEditOpportunity(updatedOpportunity);
  }

  const isInternship =
    editOpportunity?.type &&
    ['Estágio', 'estagio', 'estágio', 'Estagio'].includes(
      editOpportunity.type.label
    );

  return (
    <div className='custom-container flex flex-col'>
      <form onSubmit={putRequest}>
        <div className='bg-white rounded-2xl p-4 md:p-8'>
          <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-col w-full'>
              <span className='font-bold text-[18px] text-stone-600 mb-5'>
                Cadastro de Oportunidade
              </span>
              <div className='flex flex-col'>
                <span className='font-normal text-base text-stone-600 '>
                  Título da oportunidade
                </span>
                <input
                  type='text'
                  placeholder='Digite o título da oportunidade'
                  value={editOpportunity.title}
                  onChange={(title) => handleUpdate('title', title)}
                  className='border-b border-stone-300 p-4 outline-none'
                />
              </div>
              <div className='flex flex-col mt-6'>
                <span className='font-normal text-base text-stone-600 '>
                  Nome da empresa
                </span>
                <input
                  type='text'
                  placeholder='Digite o nome da empresa'
                  value={editOpportunity.company}
                  onChange={(company) => handleUpdate('company', company)}
                  className='border-b border-stone-300 p-4 outline-none'
                />
              </div>
              <div className='flex flex-col mt-6'>
                <span className='text-base text-stone-600 font-semibold'>
                  Tipo de oportunidade *
                </span>
                <Select
                  placeholder='Selecione...'
                  id='opportunityType'
                  styles={style}
                  options={opportunityType}
                  value={editOpportunity.type}
                  onChange={(selectedOption) =>
                    handleUpdate('type', selectedOption, false, false, true)
                  }
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                />
                {opportunityTypeError && (
                  <div style={{ color: 'red' }}>{opportunityTypeError}</div>
                )}
              </div>
              <div className='flex flex-col mt-6'>
                <span className='text-base text-stone-600 font-semibold'>
                  Área de atuação *
                </span>
                <Select
                  placeholder='Selecione...'
                  id='occupationArea'
                  styles={style}
                  options={occupationArea}
                  value={editOpportunity.occupation_area}
                  onChange={(selectedOption) =>
                    handleUpdate(
                      'occupation_area',
                      selectedOption,
                      false,
                      false,
                      true
                    )
                  }
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                />
                {occupationAreaError && (
                  <div style={{ color: 'red' }}>{occupationAreaError}</div>
                )}
              </div>
              <div className='flex flex-col mt-6'>
                <span className='text-base text-stone-600 font-semibold'>
                  Salário
                </span>
                <CurrencyInput
                  id='salary'
                  name='salary'
                  placeholder='R$ _____'
                  prefix='R$'
                  decimalSeparator=','
                  groupSeparator='.'
                  value={
                    editOpportunity.salary
                      ? editOpportunity.salary.toString()
                      : ''
                  }
                  onValueChange={(value) => {
                    if (!value) return handleUpdate('salary', '');

                    const cleanValue = Number(
                      value
                        .replace('R$', '')
                        .replace(/\./g, '')
                        .replace(',', '.')
                    );
                    handleUpdate('salary', cleanValue);
                  }}
                  className='border-b border-stone-300 p-4 outline-none'
                />
              </div>
              <div className='flex flex-col mt-6'>
                <span className='text-base text-stone-600 font-semibold'>
                  Estado *
                </span>
                <Select
                  placeholder='Selecione...'
                  id='state'
                  styles={style}
                  options={states}
                  value={editOpportunity.state}
                  onChange={(selectedOption) => {
                    handleUpdate('state', selectedOption, true);
                    setCity(null);
                    showCity(selectedOption?.id);
                  }}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                />
                {stateError && <div style={{ color: 'red' }}>{stateError}</div>}
              </div>
              <div className='flex flex-col mt-6'>
                <span className='text-base text-stone-600 font-semibold'>
                  Cidade *
                </span>
                <Select
                  placeholder='Selecione...'
                  id='city'
                  styles={style}
                  options={cities}
                  isDisabled={!editOpportunity.state}
                  value={editOpportunity.city}
                  onChange={(selectedOption) =>
                    handleUpdate('city', selectedOption, true)
                  }
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                />
                {cityError && <div style={{ color: 'red' }}>{cityError}</div>}
              </div>
              <div className='flex flex-col mt-6'>
                <span className='text-base text-stone-600 font-semibold'>
                  Descrição *
                </span>
                <textarea
                  className='border-b border-stone-300 p-4 outline-none'
                  placeholder='Digite uma descrição'
                  value={editOpportunity.description}
                  onChange={(description) =>
                    handleUpdate('description', description)
                  }
                />
                {descriptionError && (
                  <div style={{ color: 'red' }}>{descriptionError}</div>
                )}
              </div>
              <div className='flex flex-col mt-6'>
                <span className='text-base text-stone-600 font-semibold'>
                  Descrição completa *
                </span>
                <JoditEditor
                  config={editorConfig as any}
                  value={editOpportunity.full_description}
                  onChange={(fullDescription) =>
                    handleUpdate('full_description', fullDescription, true)
                  }
                />
                {fullDescriptionError && (
                  <div style={{ color: 'red' }}>{fullDescriptionError}</div>
                )}
              </div>
              <span className='text-base text-stone-600 font-semibold pb-2 pt-10'>
                Ativo *
              </span>
              <label className='switch'>
                <input
                  type='checkbox'
                  checked={editOpportunity.isOpportunityActive}
                  onChange={(e) =>
                    handleUpdate('isOpportunityActive', e, false, true)
                  }
                />
                <span className='slider round'></span>
              </label>
            </div>
          </div>
        </div>

        {isInternship && (
          <div className='bg-white rounded-2xl p-4 md:p-8 mt-8'>
            <div className='flex flex-row items-center justify-between'>
              <div className='flex flex-row w-full'>
                <span className='text-stone-600 text-base w-3/4 pr-3'>
                  {integratorSection.text}
                </span>
                <Button
                  variant='secondary'
                  borderRadius='full'
                  href={integratorSection.button_link}
                >
                  {integratorSection.button_text}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className='bg-white rounded-2xl p-4 md:p-8 mt-8 mb-10'>
          <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-row w-full justify-between'>
              <Button
                variant='tertiary'
                borderRadius='full'
                onClick={() => router.back()}
              >
                Voltar
              </Button>
              <Button
                variant='primary'
                borderRadius='full'
                type='submit'
                className='disabled:bg-opacity-50 disabled:pointer-events-none'
              >
                {isLoading && (
                  <div className='animate-spin rounded-full h-4 w-4 border-t-transparent border-2 border-white' />
                )}
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
