'use client';
import { PersonProfile } from '@/app/type/opportunity.type';
import Select from 'react-select';

import { api } from '@/app/api/api';
import Button from '@/components/button';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const JoditEditor = dynamic(() => import('jodit-react'));

import CurrencyInput from 'react-currency-input-field';

export const revalidate = 60;

type Option = {
  id: string;
  value: string;
  label: string;
};

type Setting = {
  key: string;
  value: string;
};

type OpportunityDefaultType = {
  company: string;
  title: string;
  state_id: string;
  city_id: string;
  description: string;
  date: string;
  salary: string;
  full_description: string;
  opportunity_type_id: number;
  occupation_area_id: number;
  isOpportunityActive: boolean;
  tags?: { [key: string]: any };
  [key: string]: string | number | boolean | { [key: string]: any } | undefined;
};

const opportunityDefault: OpportunityDefaultType = {
  company: '',
  title: '',
  state_id: '',
  city_id: '',
  description: '',
  date: '',
  salary: '',
  full_description: '',
  opportunity_type_id: 0,
  occupation_area_id: 0,
  isOpportunityActive: false,
};

const editorConfig = {
  toolbarAdaptive: false,
  showCharsCounter: false,
  showWordsCounter: false,
  showXPathInStatusbar: false,
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  defaultActionOnPaste: 'insert_clear_html',
  minHeight: 200,
  minWidth: null,
  buttons:
    'bold,italic,underline,|,align,ul,ol,|,|,font,fontsize,link,|,undo,redo',
  editorCssClass: 'alic',
  placeholder: '',
};

export default function NewOpportunity() {
  const [person, setPerson] = useState<PersonProfile>();
  const [newOpportunity, setNewOpportunity] =
    useState<OpportunityDefaultType>(opportunityDefault);
  const [states, setStates] = useState<Option[]>();
  const [cities, setCities] = useState<Option[]>();
  const [opportunityType, setOpportunityType] = useState<any[]>([]);
  const [occupationArea, setOccupationArea] = useState<any[]>([]);
  const [opportunityTypeSelected, setOpportunityTypeSelected] =
    useState<any>(null);
  const [occupationAreaSelected, setOccupationAreaSelected] =
    useState<any>(null);
  const [title, setTitle] = useState<Option | null>(null);
  const [company, setCompany] = useState<Option | null>(null);
  const [state, setState] = useState<Option | null>(null);
  const [city, setCity] = useState<Option | null>(null);
  const [opportunityTitleError, setOpportunityTitleError] = useState('');
  const [opportunityCompanyError, setOpportunityCompanyError] = useState('');
  const [opportunityTypeError, setOpportunityTypeError] = useState('');
  const [occupationAreaError, setOccupationAreaError] = useState('');
  const [stateError, setStateError] = useState('');
  const [cityError, setCityError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [fullDescriptionError, setFullDescriptionError] = useState('');
  const [terms, setTerms] = useState('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [integratorSection, setIntegratorSection] = useState({
    text: '',
    button_text: '',
    button_link: '',
  });

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

  const titleRef = useRef<any>(null);
  const companyRef = useRef<any>(null);
  const opportunityTypeRef = useRef<HTMLDivElement>(null);
  const occupationAreaRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<any>(null);
  const cityRef = useRef<any>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const fullDescriptionRef = useRef<HTMLDivElement>(null);

  async function showCity(selectedOption: any) {
    setState(selectedOption);
    try {
      const response = await api.get(`/city/${selectedOption.id}`);
      const cities = transformObject(response.data);
      setCities(cities);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsePerson = await api.get('/profile', {});
        const response = await api.get('/state', {});
        const states = transformObject(response.data);

        setStates(states);
        setPerson(responsePerson.data);
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

    const getSettings = async () => {
      const cachedSettings = localStorage.getItem('settings');

      if (cachedSettings) {
        const settings: Setting[] = JSON.parse(cachedSettings);
        setTerms(
          settings.find((item: Setting) => item.key === 'terms_of_opportunity')
            ?.value || ''
        );
        return;
      }

      try {
        const res = await api.get('settings');
        const settings: Setting[] = res.data;
        localStorage.setItem('settings', JSON.stringify(settings));
        setTerms(
          settings.find((item: Setting) => item.key === 'terms_of_opportunity')
            ?.value || ''
        );
      } catch (error) {
        console.error('Error fetching settings:', error);
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

    getSettings();
    getOccupationAndOpportunity();
    fetchIntegratorSection();
    fetchData();
  }, []);

  function todayDate() {
    const todayDate = new Date();

    const year = todayDate.getFullYear();
    const month = ('0' + (todayDate.getMonth() + 1)).slice(-2);
    const day = ('0' + todayDate.getDate()).slice(-2);

    return year + '-' + month + '-' + day;
  }

  function validateForm(): boolean {
    setOpportunityTitleError('');
    setOpportunityCompanyError('');
    setOpportunityTypeError('');
    setOccupationAreaError('');
    setStateError('');
    setCityError('');
    setDescriptionError('');
    setFullDescriptionError('');

    const validations = [
      {
        field: newOpportunity.title.trim().length === 0,
        errorSetter: setOpportunityTitleError,
        errorMessage: 'Escolha um título para a oportunidade',
        ref: titleRef,
      },
      {
        field: newOpportunity.company.trim().length === 0,
        errorSetter: setOpportunityCompanyError,
        errorMessage: 'Informe o nome da empresa',
        ref: companyRef,
      },
      {
        field: !opportunityTypeSelected,
        errorSetter: setOpportunityTypeError,
        errorMessage: 'Escolha um tipo de oportunidade',
        ref: opportunityTypeRef,
      },
      {
        field: !occupationAreaSelected,
        errorSetter: setOccupationAreaError,
        errorMessage: 'Escolha uma área de atuação',
        ref: occupationAreaRef,
      },
      {
        field: !state,
        errorSetter: setStateError,
        errorMessage: 'Escolha um estado',
        ref: stateRef,
      },
      {
        field: !city,
        errorSetter: setCityError,
        errorMessage: 'Escolha uma cidade',
        ref: cityRef,
      },
      {
        field: newOpportunity.description.trim().length === 0,
        errorSetter: setDescriptionError,
        errorMessage: 'Digite uma descrição',
        ref: descriptionRef,
      },
      {
        field:
          newOpportunity.full_description.replace(/<[^>]*>/g, '').trim()
            .length === 0,
        errorSetter: setFullDescriptionError,
        errorMessage: 'Digite uma descrição completa',
        ref: fullDescriptionRef,
      },
    ];

    let firstInvalidRef: any = null;

    validations.forEach((validation) => {
      if (validation.field) {
        validation.errorSetter(validation.errorMessage);
        if (!firstInvalidRef && validation.ref?.current) {
          firstInvalidRef = validation.ref;
        }
      }
    });

    if (firstInvalidRef?.current) {
      firstInvalidRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      firstInvalidRef.current.focus();
    }

    return !firstInvalidRef;
  }

  async function postRequest(e: any) {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await api.post('profile/opportunity', {
        ...newOpportunity,
        date: todayDate(),
        state_id: Number(state?.id),
        city_id: Number(city?.id),
        occupation_area_id: Number(occupationAreaSelected?.id),
        opportunity_type_id: Number(opportunityTypeSelected?.id),
        user_id: person?.id,
        status: newOpportunity.isOpportunityActive,
      });

      console.log('Response:', response.data);

      const { opportunity: createdOpportunity } = response.data;

      if (!createdOpportunity?.id) {
        console.error('Invalid opportunity ID:', createdOpportunity?.id);
        toast.error('Erro ao criar a oportunidade.');
        setIsLoading(false);
        return;
      }

      const emailPayload = {
        opportunityTitle: createdOpportunity.title,
        opportunityLink: `https://conexoesengenharia.com.br/oportunidade/${createdOpportunity.id}`,
      };

      await api.post(
        `/send-opportunity-email/${createdOpportunity.id}`,
        emailPayload
      );

      toast.success('Dados salvos com sucesso!');
      setIsLoading(false);
      router.push('/minhas-oportunidades');
      router.refresh();
    } catch (error) {
      toast.error('Ops. Não conseguimos processar sua solicitação');
      setIsLoading(false);
      console.error('Error fetching data:', error);
    }
  }

  function handleUpdate(
    type: keyof OpportunityDefaultType,
    updatedInfo: any,
    isSelectOrFullDescription: boolean = false,
    isCheckbox: boolean = false,
    isTags: boolean = false
  ) {
    const opportunity = { ...newOpportunity };
    if (isSelectOrFullDescription) {
      (opportunity as any)[type] = updatedInfo;
    } else if (isCheckbox) {
      (opportunity as any)[type] = updatedInfo.target.checked;
    } else if (isTags) {
      opportunity.tags = { ...opportunity.tags, [type]: updatedInfo };
    } else if (updatedInfo && updatedInfo.target !== undefined) {
      (opportunity as any)[type] = updatedInfo.target.value;
    } else {
      (opportunity as any)[type] = updatedInfo;
    }
    setNewOpportunity(opportunity);
  }

  const isInternship =
    opportunityTypeSelected &&
    ['Estágio', 'estagio', 'estágio', 'Estagio'].includes(
      opportunityTypeSelected.label
    );

  if (!person) return;

  return (
    <div className='custom-container flex flex-col'>
      <div
        className='p-4 mb-4 text-sm text-yellow-800 bg-yellow-50 border border-yellow-300 rounded-2xl'
        role='alert'
      >
        <span className='font-bold text-xl'>Atenção!</span>
        <div dangerouslySetInnerHTML={{ __html: terms }} />
      </div>
      <form onSubmit={postRequest}>
        <div className='bg-white rounded-2xl p-4 md:p-8'>
          <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-col w-full'>
              <span className='font-bold text-[18px] text-stone-600 mb-5'>
                Cadastro de Oportunidade
              </span>
              <div className='flex flex-col' ref={titleRef}>
                <span className='text-base text-stone-600 font-semibold'>
                  Título da oportunidade *
                </span>
                <input
                  type='text'
                  placeholder='Digite o título da oportunidade'
                  value={newOpportunity.title}
                  onChange={(title) => handleUpdate('title', title)}
                  className='border-b border-stone-300 p-4 outline-none'
                />
                {opportunityTitleError && (
                  <div style={{ color: 'red' }}>{opportunityTitleError}</div>
                )}
              </div>
              <div className='flex flex-col mt-6' ref={companyRef}>
                <span className='text-base text-stone-600 font-semibold'>
                  Nome da empresa *
                </span>
                <input
                  type='text'
                  placeholder='Digite o nome da empresa'
                  value={newOpportunity.company}
                  onChange={(company) => handleUpdate('company', company)}
                  className='border-b border-stone-300 p-4 outline-none'
                />
                {opportunityCompanyError && (
                  <div style={{ color: 'red' }}>{opportunityCompanyError}</div>
                )}
              </div>
              <div className='flex flex-col mt-6' ref={opportunityTypeRef}>
                <span className='text-base text-stone-600 font-semibold'>
                  Tipo de oportunidade *
                </span>
                <Select
                  placeholder='Selecione...'
                  id='opportunityType'
                  styles={style}
                  options={opportunityType}
                  value={opportunityTypeSelected}
                  onChange={(selectedOption) =>
                    setOpportunityTypeSelected(selectedOption)
                  }
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                />
                {opportunityTypeError && (
                  <div style={{ color: 'red' }}>{opportunityTypeError}</div>
                )}
              </div>
              <div className='flex flex-col mt-6' ref={occupationAreaRef}>
                <span className='text-base text-stone-600 font-semibold'>
                  Área de atuação *
                </span>
                <Select
                  placeholder='Selecione...'
                  id='occupationArea'
                  styles={style}
                  options={occupationArea}
                  value={occupationAreaSelected}
                  onChange={(selectedOption) =>
                    setOccupationAreaSelected(selectedOption)
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
                  value={newOpportunity.salary}
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
              <div className='flex flex-col mt-6' ref={stateRef}>
                <span className='text-base text-stone-600 font-semibold'>
                  Estado *
                </span>
                <Select
                  placeholder='Selecione...'
                  id='state'
                  styles={style}
                  options={states}
                  value={state}
                  onChange={(selectedOption) => {
                    setState(selectedOption);
                    setCity(null);
                    showCity(selectedOption);
                  }}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                />
                {stateError && <div style={{ color: 'red' }}>{stateError}</div>}
              </div>
              <div className='flex flex-col mt-6' ref={cityRef}>
                <span className='text-base text-stone-600 font-semibold'>
                  Cidade *
                </span>
                <Select
                  placeholder='Selecione...'
                  id='city'
                  styles={style}
                  options={cities}
                  isDisabled={!state}
                  value={city}
                  onChange={(selectedOption) => setCity(selectedOption)}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                />
                {cityError && <div style={{ color: 'red' }}>{cityError}</div>}
              </div>
              <div className='flex flex-col mt-6'>
                <span
                  className='text-base text-stone-600 font-semibold'
                  ref={descriptionRef}
                >
                  Descrição *
                </span>
                <textarea
                  className='border-b border-stone-300 p-4 outline-none'
                  placeholder='Digite uma descrição'
                  value={newOpportunity.description}
                  onChange={(description) =>
                    handleUpdate('description', description)
                  }
                />
                {descriptionError && (
                  <div style={{ color: 'red' }}>{descriptionError}</div>
                )}
              </div>
              <div className='flex flex-col mt-6' ref={fullDescriptionRef}>
                <span className='text-base text-stone-600 font-semibold'>
                  Descrição completa *
                </span>

                <JoditEditor
                  config={editorConfig as any}
                  value={newOpportunity.full_description}
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
                  checked={newOpportunity.isOpportunityActive}
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
                  target='_blank'
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
              <Link href='/minhas-oportunidades'>
                <Button variant='tertiary' borderRadius='full'>
                  Voltar
                </Button>
              </Link>
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
