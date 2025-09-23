'use client';
import { api } from '@/app/api/api';
import Button from '@/components/button';
import phoneMask from '@/utils/phone-mask';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { ModalAcademic } from '../modalAcademic';

const JoditEditor = dynamic(() => import('jodit-react'));

const { accessToken } = parseCookies();

type Props = {
  person: any;
};

interface Option {
  id: string;
  value: string;
  label: string;
}

interface Education {
  id: string;
  title: string;
  course: string;
  institution: string;
  conclusion_at: string;
  current_situation: string;
}

interface Profile {
  id: string;
  image: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  full_description: string;
  bannerProfile?: File | null;
  sengeAssociate: boolean;
  curriculum: File | string | null;
  state: {
    id: string;
    value: string;
    label: string;
  };
  city: {
    id: string;
    value: string;
    label: string;
  };
  address: string;
  complement: string;
  link_site: string;
  link_linkedin: string;
  link_twitter: string;
  link_instagram: string;
  delete_curriculum?: string;
  educations: Education[];
}

const options: Option[] = [
  { id: '0', value: 'Selecione um estado', label: 'Selecione um estado' },
];

const editorConfig = {
  toolbarAdaptive: false,
  showCharsCounter: false,
  showWordsCounter: false,
  showXPathInStatusbar: false,
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  minHeight: 200,
  minWidth: null,
  buttons:
    'bold,italic,underline,|,align,ul,ol,|,|,font,fontsize,link,|,undo,redo',
  editorCssClass: 'alic',
  placeholder: '',
};

export default function EditProfile({ person }: Props) {
  const inputLabelClasses = 'text-base text-stone-600 font-semibold';
  const inputClasses = 'border-b border-stone-300 p-4 outline-none';

  const [editProfile, setEditProfile] = useState<Profile>({
    ...person,
    state: {
      id: person.state.id.toString(),
      value: person.state.title,
      label: person.state.title,
    },
    city: {
      id: person.city.id.toString(),
      value: person.city.title,
      label: person.city.title,
    },
  });

  const [curriculumFile, setCurriculumFile] = useState<File | null>(null);

  const [states, setStates] = useState(options);
  const [cities, setCities] = useState(options);
  const [state, setState] = useState<Option | null>(null);
  const [city, setCity] = useState<Option | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [academicId, setAcademicId] = useState('');
  const [addNewCourse, setAddNewCourse] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [stateError, setStateError] = useState('');
  const [cityError, setCityError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [complementError, setComplementError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [fullDescriptionError, setFullDescriptionError] = useState('');
  const [hasChangedCv, setHasChangedCv] = useState(false);
  const [hasChangedCover, setHasChangedCover] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<any>(null);
  const cityRef = useRef<any>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const fullDescriptionRef = useRef<any>(null);

  const [deleteCurriculum, setDeleteCurriculum] = useState(false);

  const router = useRouter();

  function validateForm() {
    const validations = [
      {
        field: editProfile.name,
        errorSetter: setNameError,
        errorMessage: 'Digite seu nome',
        ref: nameRef,
      },
      {
        field: editProfile.state?.label,
        errorSetter: setStateError,
        errorMessage: 'Escolha um estado',
        ref: stateRef,
      },
      {
        field: editProfile.city?.label,
        errorSetter: setCityError,
        errorMessage: 'Escolha uma cidade',
        ref: cityRef,
      },
      {
        field: !(
          editProfile.phone.length >= 13 && editProfile.phone.length <= 15
        ),
        errorSetter: setPhoneError,
        errorMessage: 'Digite um telefone válido',
        ref: phoneRef,
      },
      {
        field: editProfile.description.length === 0,
        errorSetter: setDescriptionError,
        errorMessage: 'Digite uma descrição',
        ref: descriptionRef,
      },
      {
        field: editProfile.address.length === 0,
        errorSetter: setAddressError,
        errorMessage: 'Digite seu endereço',
        ref: addressRef,
      },
      {
        field:
          editProfile.full_description.replace(/<[^>]*>/g, '').length === 0,
        errorSetter: setFullDescriptionError,
        errorMessage: 'Digite uma descrição completa',
        ref: fullDescriptionRef,
      },
    ];

    let firstInvalidRef: any = null;
    for (const validation of validations) {
      if (
        typeof validation.field === 'boolean'
          ? validation.field
          : validation.field.length === 0
      ) {
        validation.errorSetter(validation.errorMessage);
        if (!firstInvalidRef) firstInvalidRef = validation.ref;
      }
    }
    if (firstInvalidRef?.current) {
      firstInvalidRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      firstInvalidRef.current.focus();
    }
    setTimeout(() => {
      setNameError('');
      setEmailError('');
      setCityError('');
      setStateError('');
      setPhoneError('');
      setDescriptionError('');
      setFullDescriptionError('');
    }, 5000);
    return !firstInvalidRef;
  }

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

  function transformObject(object: any): Option[] {
    return object.map((item: { id: any; title: any }) => ({
      id: Number(item.id),
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
        if (person.state && person.city) {
          setEditProfile({
            ...editProfile,
            state: {
              id: person.state.id,
              value: person.state.title,
              label: person.state.title,
            },
            city: {
              id: person.city.id,
              value: person.city.title,
              label: person.city.title,
            },
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleUpdate(
    name: string,
    event: ChangeEvent<HTMLInputElement> | any,
    isLink: boolean = false,
    isSelectOrFullDescription: boolean = false,
    isFileInput: boolean = false,
    isPhone: boolean = false
  ) {
    const updatedProfile: any = { ...editProfile };
    if (isSelectOrFullDescription) {
      updatedProfile[name] = event;
    } else if (isFileInput) {
      const file = event?.target?.files?.[0];
      if (file) {
        updatedProfile[name] = file;
      }
    } else if (isPhone) {
      updatedProfile[name] = phoneMask(event.target.value);
    } else if (isLink) {
      const urlValue = event.target.value;
      updatedProfile[name] =
        urlValue.startsWith('http://') || urlValue.startsWith('https://')
          ? urlValue
          : 'https://' + urlValue;
    } else {
      updatedProfile[name] = event.target.value;
    }
    setEditProfile(updatedProfile);
  }

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      // Método PUT via spoofing
      formData.append('_method', 'PUT');

      // Campos de texto / números
      formData.append('name', editProfile.name);
      formData.append('phone', editProfile.phone);
      formData.append('description', editProfile.description);
      formData.append('full_description', editProfile.full_description);
      formData.append('state_id', String(editProfile.state.id));
      formData.append('city_id', String(editProfile.city.id));
      formData.append('address', editProfile.address);
      formData.append('complement', editProfile.complement ?? '');
      formData.append('link_site', editProfile.link_site ?? '');
      formData.append('link_twitter', editProfile.link_twitter ?? '');
      formData.append('link_linkedin', editProfile.link_linkedin ?? '');
      formData.append('link_instagram', editProfile.link_instagram ?? '');

      // Flag para deletar currículo
      formData.append('delete_curriculum', deleteCurriculum ? '1' : '0');

      // Banner de capa (se trocou)
      if (hasChangedCover && editProfile.bannerProfile instanceof File) {
        formData.append('banner_profile', editProfile.bannerProfile);
      }

      // Currículo (PDF/DOC)
      if (hasChangedCv && curriculumFile) {
        console.log(
          'Adding curriculum file to form data:',
          curriculumFile.name
        );
        formData.append('curriculum', curriculumFile);
      }

      // Debug form data
      console.log('Form Data entries:');
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      const response = await api.post('/profile', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response.data);
      toast.success('Dados salvos com sucesso!');
      router.refresh();
      router.push('/meu-perfil');
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err.response?.data || err);
      toast.error(
        err.response?.data?.message ||
          'Ops! Tivemos um problema para processar sua requisição.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteAcademicEducation(academicId: string) {
    try {
      await api.delete(`profile/education/${academicId}`);
      setEditProfile((prev: Profile) => ({
        ...prev,
        educations: prev.educations.filter((e) => e.id !== academicId),
      }));
      toast.success('Qualificação removida com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover a qualificação.');
      console.error('Error deleting qualification:', error);
    }
  }

  function closeModal() {
    setEditModal(false);
    setAcademicId('');
    setAddNewCourse(false);
  }

  function openModal(academicId = 'empty') {
    setEditModal(true);
    setAcademicId(academicId);
    setAddNewCourse(academicId === 'empty');
  }

  function handleErrorMessage(message: string) {
    return <div style={{ color: 'red' }}>{message}</div>;
  }

  function handleAddOrUpdateQualification(newQualification?: Education) {
    if (
      !newQualification ||
      !newQualification.course.trim() ||
      !newQualification.institution.trim()
    ) {
      toast.error('Curso e Instituição são obrigatórios.');
      return;
    }
    setEditProfile((prev: Profile) => {
      const updatedQualifications = Array.isArray(prev.educations)
        ? prev.educations
        : [];
      const newEducations = addNewCourse
        ? [...updatedQualifications, newQualification]
        : updatedQualifications.map((qualification) =>
            qualification.id === newQualification.id
              ? newQualification
              : qualification
          );
      return { ...prev, educations: newEducations };
    });
    closeModal();
  }

  const [curriculumUrl, setCurriculumUrl] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    console.log('Initial person data:', person);
    if (person.curriculum) {
      console.log('Curriculum from API:', person.curriculum);
    }
  }, []);

  useEffect(() => {
    // When component loads or curriculum changes
    if (editProfile.curriculum) {
      if (typeof editProfile.curriculum === 'string') {
        console.log('Curriculum string value:', editProfile.curriculum);

        // If it's already a full URL
        if (editProfile.curriculum.startsWith('http')) {
          setCurriculumUrl(editProfile.curriculum);
        } else {
          // Get the base domain without any path segments
          const baseApiUrl =
            process.env.NEXT_PUBLIC_API ||
            'https://admin.conexoesengenharia.com.br/api/';

          // Extract just the domain portion - everything before the first occurrence of /api
          const domainOnly = baseApiUrl.split('/api')[0];

          // Construct a clean URL with the domain and storage path
          const url = `${domainOnly}/storage/${editProfile.curriculum}`;
          setCurriculumUrl(url);
          console.log('Constructed curriculum URL:', url);
        }
      } else if (editProfile.curriculum instanceof File) {
        setCurriculumUrl(URL.createObjectURL(editProfile.curriculum));
      }
    } else {
      setCurriculumUrl(undefined);
    }
  }, [editProfile.curriculum]);

  return (
    <div className='custom-container flex flex-col'>
      <span className='font-bold text-[18px] text-stone-600 mb-5 mt-5 min-[600px]:hidden'>
        Dados Básicos
      </span>
      <form onSubmit={updateProfile}>
        <div className='bg-white rounded-2xl p-4 md:p-8'>
          <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-col w-full'>
              <span className='font-bold text-[18px] text-stone-600 mb-5'>
                Dados Básicos
              </span>

              <div className='flex flex-col'>
                <span className={inputLabelClasses}>Nome *</span>
                <input
                  type='text'
                  placeholder='Digite seu nome'
                  value={editProfile.name}
                  onChange={(e) => handleUpdate('name', e)}
                  className={inputClasses}
                  ref={nameRef}
                />
                {nameError && handleErrorMessage(nameError)}
              </div>
              <div className='flex flex-col mt-6'>
                <span className={inputLabelClasses}>E-mail *</span>
                <input
                  type='text'
                  placeholder='Digite seu e-mail'
                  className={inputClasses}
                  value={editProfile.email}
                  disabled
                />
                {emailError && handleErrorMessage(emailError)}
              </div>
              <div className='flex flex-col mt-6'>
                <span className={inputLabelClasses}>Telefone *</span>
                <input
                  type='text'
                  placeholder='Digite seu telefone'
                  value={editProfile.phone}
                  onChange={(e) =>
                    handleUpdate('phone', e, false, false, false, true)
                  }
                  className={inputClasses}
                  ref={phoneRef}
                />
                {phoneError && handleErrorMessage(phoneError)}
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-2xl p-4 md:p-8 mt-8'>
          <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-col w-full'>
              <span className='font-bold text-[18px] text-stone-600 mb-5'>
                Endereço
              </span>
              <div className='flex flex-col'>
                <span className={inputLabelClasses}>Estado *</span>
                <Select
                  placeholder='Selecione...'
                  id='state'
                  styles={style}
                  options={states}
                  value={editProfile.state}
                  onChange={(selectedOption) => {
                    handleUpdate('state', selectedOption, false, true);
                    setCity(null);
                    showCity(selectedOption?.id);
                  }}
                  components={{ IndicatorSeparator: () => null }}
                  ref={stateRef}
                />
                {stateError && handleErrorMessage(stateError)}
              </div>
              <div className='flex flex-col mt-6'>
                <span className={inputLabelClasses}>Cidade *</span>
                <Select
                  placeholder='Selecione...'
                  id='city'
                  styles={style}
                  options={cities}
                  isDisabled={!editProfile.state}
                  value={editProfile.city}
                  onChange={(selectedOption) =>
                    handleUpdate('city', selectedOption, false, true)
                  }
                  components={{ IndicatorSeparator: () => null }}
                  ref={cityRef}
                />
                {cityError && handleErrorMessage(cityError)}
              </div>
              <div className='flex flex-col mt-6'>
                <span className={inputLabelClasses}>Endereço *</span>
                <input
                  type='text'
                  placeholder='Digite sua rua e número da residência'
                  value={editProfile.address}
                  onChange={(e) => handleUpdate('address', e)}
                  className={inputClasses}
                  ref={addressRef}
                />
                {addressError && (
                  <div style={{ color: 'red' }}>{addressError}</div>
                )}
              </div>
              <div className='flex flex-col mt-6'>
                <span className={inputLabelClasses}>Complemento</span>
                <input
                  type='text'
                  placeholder='Ex: Apto1, Sala 2, Bloco  3'
                  value={editProfile.complement}
                  onChange={(e) => handleUpdate('complement', e)}
                  className={inputClasses}
                />
                {complementError && handleErrorMessage(complementError)}
              </div>
            </div>
          </div>
        </div>

        {Array.isArray(editProfile.educations) &&
          editProfile.educations.map((academicEducation: Education, index) => (
            <div
              className='bg-white rounded-2xl p-4 md:p-8 mt-8'
              key={academicEducation?.id || index}
            >
              <span className='text-[18px] text-stone-600 font-bold'>
                Educação / Formação acadêmica
              </span>
              <div className='flex flex-col'>
                <span className='text-stone-800 text-base mt-5'>
                  Curso:{' '}
                  <span className='text-stone-400 font-medium'>
                    {academicEducation?.course || 'Não informado'}
                  </span>
                </span>
                <span className='text-stone-800 text-base mt-5'>
                  Instituição:{' '}
                  <span className='text-stone-400 font-medium'>
                    {academicEducation?.institution || 'Não informado'}
                  </span>
                </span>
              </div>
              <div className='border-t flex flex-row w-full justify-between pt-6 mt-6'>
                <Button
                  variant='tertiary'
                  borderRadius='full'
                  onClick={() => openModal(academicEducation.id)}
                >
                  <strong>Editar</strong>
                </Button>
                <Button
                  variant='danger'
                  borderRadius='full'
                  onClick={() => deleteAcademicEducation(academicEducation.id)}
                >
                  Remover
                </Button>
              </div>
            </div>
          ))}

        <div className='w-full mt-8 flex justify-center'>
          <Button
            variant='primary'
            borderRadius='full'
            onClick={() => openModal()}
          >
            + Adicionar qualificação
          </Button>
        </div>

        <div className='bg-white rounded-2xl p-4 md:p-8 mt-8 mb-10 flex flex-col'>
          <span className='text-[18px] text-stone-600 font-bold'>
            Dados complementares
          </span>

          <div className='flex flex-col mt-6'>
            <span className={inputLabelClasses}>
              Imagem de capa(1320px x 200px)
            </span>
            {editProfile.bannerProfile && !hasChangedCover && (
              <Image
                src={URL.createObjectURL(editProfile.bannerProfile)}
                alt='Banner do perfil'
                className='w-full object-cover h-44 rounded-3xl border-2 border-stone-200'
                width={1230}
                height={280}
              />
            )}
            <label
              htmlFor='file-upload-banner'
              className='custom--banner border-b border-stone-300 p-4 pb-10 max-[600px]:pb-8'
            >
              <input
                placeholder='Selecione um arquivo...'
                id='file-upload-banner'
                type='file'
                accept='.jpg, .JPEG, .jpeg, .JPG, .png, .PNG'
                onChange={(e) => {
                  setHasChangedCover(true);
                  handleUpdate('bannerProfile', e, false, false, true);
                }}
              />
            </label>
            <span className='font-normal text-sm text-stone-400 mt-5 max-[600px]:text-[12px]'>
              Formatos suportados JPG, PNG com no máximo 2MB
            </span>
          </div>

          <div className='flex flex-col mt-6'>
            <span className={inputLabelClasses}>Site</span>
            <input
              type='text'
              placeholder='https://seusite.com'
              value={editProfile.link_site}
              onChange={(e) => handleUpdate('link_site', e, true)}
              className={inputClasses}
            />
          </div>
          <div className='flex flex-col mt-6'>
            <span className={inputLabelClasses}>Twitter</span>
            <input
              type='text'
              placeholder='https://twitter.com/usuario'
              value={editProfile.link_twitter}
              onChange={(e) => handleUpdate('link_twitter', e, true)}
              className={inputClasses}
            />
          </div>
          <div className='flex flex-col mt-6'>
            <span className={inputLabelClasses}>Linkedin</span>
            <input
              type='text'
              placeholder='https://linkedin.com/in/usuario'
              value={editProfile.link_linkedin}
              onChange={(e) => handleUpdate('link_linkedin', e, true)}
              className={inputClasses}
            />
          </div>
          <div className='flex flex-col mt-6'>
            <span className={inputLabelClasses}>Instagram</span>
            <input
              type='text'
              placeholder='https://instagram.com/usuario'
              value={editProfile.link_instagram}
              onChange={(e) => handleUpdate('link_instagram', e, true)}
              className={inputClasses}
            />
          </div>

          <div className='flex flex-col mt-6'>
            <span className={inputLabelClasses}>Descrição *</span>
            <textarea
              className={inputClasses}
              placeholder='Digite uma descrição'
              value={editProfile.description}
              onChange={(e) => handleUpdate('description', e)}
              ref={descriptionRef}
            />
            {descriptionError && handleErrorMessage(descriptionError)}
          </div>
          <div className='flex flex-col mt-6'>
            <span className={inputLabelClasses}>Descrição completa*</span>
            <JoditEditor
              config={editorConfig}
              value={editProfile.full_description}
              onChange={(value) =>
                handleUpdate('full_description', value, false, true)
              }
              ref={fullDescriptionRef}
            />
            {fullDescriptionError && handleErrorMessage(fullDescriptionError)}
          </div>

          <div className='flex flex-col mt-6'>
            <span className='text-base text-stone-600 font-semibold'>
              Curriculum
            </span>
            {editProfile.curriculum && !hasChangedCv ? (
              <div className='w-full mt-8 flex flex-col sm:flex-row gap-4'>
                <Button
                  variant='primary'
                  borderRadius='full'
                  href={curriculumUrl}
                  download
                  target='_blank'
                  onClick={(e) => {
                    if (!curriculumUrl) {
                      e.preventDefault();
                      toast.error('Não foi possível acessar o arquivo');
                      console.error('Curriculum URL is undefined');
                    }
                  }}
                >
                  Visualizar Currículum
                </Button>
                <Button
                  variant='danger'
                  borderRadius='full'
                  onClick={async () => {
                    try {
                      await api.delete(`profile/curriculum/${editProfile.id}`);
                      toast.success('Currículum removido com sucesso!');
                      setEditProfile((prev) => ({ ...prev, curriculum: null }));
                      setHasChangedCv(false);
                      setDeleteCurriculum(false);
                    } catch (error) {
                      toast.error('Erro ao remover o currículum.');
                      console.error('Error deleting curriculum:', error);
                    }
                  }}
                >
                  Remover Currículum
                </Button>
              </div>
            ) : (
              <label
                htmlFor='file-upload'
                className='custom-file-upload border-b border-stone-300 p-4 pb-10 mt-4'
              >
                <input
                  name='curriculum'
                  placeholder='Selecione um arquivo...'
                  accept='.pdf,.doc,.docx,.jpg,.jpeg,.png'
                  id='file-upload'
                  type='file'
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        toast.error('O arquivo deve ter no máximo 2MB');
                        return;
                      }

                      const validTypes = [
                        '.pdf',
                        '.doc',
                        '.docx',
                        '.jpg',
                        '.jpeg',
                        '.png',
                      ];
                      const fileExtension =
                        '.' + file.name.split('.').pop()?.toLowerCase();
                      if (!validTypes.includes(fileExtension)) {
                        toast.error('Formato de arquivo não suportado');
                        return;
                      }

                      console.log('Setting curriculum file:', file.name);
                      setCurriculumFile(file);
                      setHasChangedCv(true);
                      setDeleteCurriculum(false);
                    }
                  }}
                />
              </label>
            )}
            <span className='text-sm text-stone-400'>
              Formatos suportados PDF, DOCX, JPG, PNG com no máximo 2MB
            </span>
          </div>
        </div>

        <div className='bg-white rounded-2xl p-4 md:p-8 mb-10'>
          <div className='flex flex-row items-center'>
            <div className='flex flex-row justify-between w-full'>
              <Button variant='tertiary' borderRadius='full' href='/meu-perfil'>
                Voltar
              </Button>
              <Button
                variant='primary'
                borderRadius='full'
                type='submit'
                className='disabled:bg-opacity-50'
                disabled={isLoading}
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
      {editModal && (
        <ModalAcademic
          profile={editProfile}
          callback={handleAddOrUpdateQualification}
          closeModal={closeModal}
          academicId={academicId}
          addNewCourse={addNewCourse}
        />
      )}
    </div>
  );
}
