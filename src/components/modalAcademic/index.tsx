import {
  AcademicInformation,
  PersonProfile,
} from '@/app/type/opportunity.type';

import { api } from '@/app/api/api';
import { ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../button';

type Props = {
  profile: PersonProfile;
  callback: any;
  closeModal: any;
  academicId: string;
  addNewCourse: boolean;
};

export function ModalAcademic({
  profile,
  callback,
  closeModal,
  academicId,
  addNewCourse,
}: Props) {
  const editEducation: AcademicInformation = profile.educations.filter(
    (education) => education.id === academicId
  )[0];

  const [academicStudy, setAcademicStudy] = useState<AcademicInformation>(
    editEducation || {
      conclusion_at: '',
      course: '',
      institution: '',
      current_situation: '',
      observation: '',
    }
  );

  async function updateAcademicStudy() {
    if (!academicStudy || !academicStudy.id) return;

    try {
      await api.put(`/profile/education/${academicStudy.id}`, academicStudy);
      toast.success('Atualização feita com sucesso!');
      callback(academicStudy);
      closeModal();
    } catch (error) {
      toast.error('Erro ao atualizar os dados.');
      console.error('Error fetching data:', error);
    }
  }

  async function addAcademicStudy() {
    if (!academicStudy.course.trim() || !academicStudy.institution.trim()) {
      toast.error('Curso e Instituição são obrigatórios.');
      return;
    }

    try {
      const response = await api.post('/profile/education', academicStudy);
      const savedData = response.data;

      toast.success('Dados salvos com sucesso!');

      callback({ ...academicStudy, id: savedData.id });

      closeModal();
    } catch (error) {
      toast.error('Ops. Não conseguimos processar sua solicitação');
      console.error('Error fetching data:', error);
    }
  }

  function handleUpdate(
    type: keyof AcademicInformation,
    updatedInfo: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    isRadioButton: boolean = false
  ) {
    setAcademicStudy((prev) => ({
      ...prev,
      [type]: isRadioButton
        ? updatedInfo
        : (updatedInfo as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
            .target.value,
    }));
  }

  return (
    <div className='fixed top-0 left-0 w-full h-full overflow-auto bg-black bg-opacity-50 flex justify-center items-center'>
      <div
        className='flex flex-col justify-center items-center rounded-2xl bg-white w-2/5 px-6 py-10'
        style={{ height: '80vh' }}
      >
        <div className='flex flex-col w-full max-h-full overflow-auto'>
          <div className='flex flex-col w-full'>
            <span className='font-bold text-[18px] text-stone-600 mb-5'>
              Educação / Formação acadêmica
            </span>
            <div className='flex flex-col'>
              <span className='text-base text-stone-600 font-semibold'>
                Curso *
              </span>
              <input
                type='text'
                placeholder='Informe o curso / graduação'
                value={academicStudy.course}
                onChange={(curso) => handleUpdate('course', curso)}
                className='border-b border-stone-300 p-4 outline-none'
              />
            </div>
            <div className='flex flex-col mt-6'>
              <span className='text-base text-stone-600 font-semibold'>
                Instituição *
              </span>
              <input
                type='text'
                placeholder='Informe a instituicao'
                value={academicStudy.institution}
                onChange={(instituicao) =>
                  handleUpdate('institution', instituicao)
                }
                className='border-b border-stone-300 p-4 outline-none'
              />
            </div>
            <div className='flex flex-col mt-6'>
              <span className='text-base text-stone-600 font-semibold'>
                Data de conclusão *
              </span>
              <input
                type='date'
                value={academicStudy.conclusion_at}
                onChange={(conclusionDate) =>
                  handleUpdate('conclusion_at', conclusionDate)
                }
                className='border-b border-stone-300 p-4 outline-none'
              />
            </div>
            <div className='flex flex-col mt-6'>
              <span className='text-base text-stone-600 font-semibold'>
                Situação atual *
              </span>
              <div className='flex flex-row'>
                <div className='mt-5 flex'>
                  <input
                    type='radio'
                    id='option1'
                    name='option'
                    className='w-[20px]'
                    value='Cursando'
                    onClick={(situacaoAtual) =>
                      handleUpdate('current_situation', 'in_progress', true)
                    }
                    defaultChecked={
                      academicStudy.current_situation === 'in_progress'
                    }
                  />
                  <label htmlFor='option1' className='pl-2'>
                    Em curso
                  </label>
                </div>

                <div className='mt-5 ml-4 flex'>
                  <input
                    type='radio'
                    id='option2'
                    name='option'
                    className='w-[20px]'
                    value='Concluido'
                    onClick={(situacaoAtual) =>
                      handleUpdate('current_situation', 'done', true)
                    }
                    defaultChecked={academicStudy.current_situation === 'done'}
                  />
                  <label htmlFor='option2' className='pl-2'>
                    Concluído
                  </label>
                </div>
                <div className='mt-5 ml-4 flex'>
                  <input
                    type='radio'
                    id='option3'
                    name='option'
                    className='w-[20px]'
                    value='Interrompido'
                    onClick={(situacaoAtual) =>
                      handleUpdate('current_situation', 'interrupted', true)
                    }
                    defaultChecked={
                      academicStudy.current_situation === 'interrupted'
                    }
                  />
                  <label htmlFor='option3' className='pl-2'>
                    Interrompido
                  </label>
                </div>
              </div>
            </div>
            <div className='flex flex-col mt-6'>
              <span className='text-base text-stone-600 font-semibold'>
                Observação *
              </span>
              <textarea
                className='border-b border-stone-300 p-4 outline-none'
                placeholder='Digite sua observação'
                value={academicStudy.observation}
                onChange={(event) => handleUpdate('observation', event)}
              ></textarea>
            </div>
          </div>
          <div className='bg-white rounded-b-[30px] py-4 px-6 justify-between flex flex-row w-full items-center'>
            <Button
              variant='secondary'
              borderRadius='full'
              onClick={() => {
                setAcademicStudy({
                  id: '',
                  conclusion_at: '',
                  course: '',
                  institution: '',
                  current_situation: '',
                  observation: '',
                });
                closeModal();
              }}
            >
              Cancelar
            </Button>
            <Button
              variant='primary'
              borderRadius='full'
              onClick={addNewCourse ? addAcademicStudy : updateAcademicStudy}
            >
              Salvar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
