/* eslint-disable @next/next/no-img-element */
'use client';
import instagram from '@/assets/instagram.png';
import internet from '@/assets/internet.png';
import linkedin from '@/assets/linkedin.png';
import twitter from '@/assets/twitter.png';
import Button from '@/components/button';
import { useSession } from 'next-auth/react';

import { getVersionedImageUrl } from '@/utils/version-image';
import Image from 'next/image';
import Link from 'next/link';
import { BackButton } from '../back-button';

type Props = {
  person: any;
  isLoggedProfile?: boolean;
  showBackbutton?: boolean;
};

const BASE_STORAGE_URL = 'https://admin.conexoesengenharia.com.br/storage/';

export default function Profile({
  person,
  isLoggedProfile = false,
  showBackbutton = false,
}: Props) {
  function currentSituation(academicStudy: any) {
    switch (academicStudy.current_situation) {
      case 'in_progress':
        return 'Em curso';
      case 'done':
        return 'Concluído';
      case 'interrupted':
        return 'Interrompido';
    }
  }

  const { data: session, status } = useSession();

  const avatarSrc = session?.user?.image
    ? getVersionedImageUrl(session.user.image)
    : person.image
    ? getVersionedImageUrl(person.image)
    : 'https://cdn-icons-png.flaticon.com/512/266/266033.png';

  const curriculumUrl =
    typeof person.curriculum === 'string'
      ? `${BASE_STORAGE_URL}${person.curriculum}`
      : person.curriculum;

  return (
    <div className='custom-container flex flex-col mb-8 max-[600px]:mt-[20px]'>
      <div className='bg-white rounded-2xl p-4 md:p-8 flex flex-col gap-20'>
        <div className='relative'>
          {person.banner_profile ? (
            <Image
              src={getVersionedImageUrl(person.banner_profile)}
              alt='Banner do perfil'
              className='w-full absolute top-0 left-0 object-cover h-44 rounded-3xl'
              width={1230}
              height={200}
            />
          ) : (
            <div className='w-full absolute top-0 left-0 object-cover h-44 rounded-3xl bg-gray-400'></div>
          )}

          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt='Foto do perfil'
              className='rounded-[30px] border-2 absolute top-[130px] left-[20px] z-1'
              width={100}
              height={100}
            />
          ) : (
            <div className='bg-gray-400 h-[100px] w-[100px] rounded-[30px] border-2 absolute top-[130px] left-[20px] z-1 '></div>
          )}
        </div>
        <div className='mt-[120px]'>
          <div className='flex flex-col-reverse items-end md:flex-row md:items-center md:justify-between pt-10'>
            <div className='flex-1 w-full'>
              <strong className='text-4xl text-stone-700 max-[600px]:text-2xl'>
                {person.name}
              </strong>
              <div className='flex-col flex xl:flex-row gap-3 mt-4 xl:items-center'>
                {person.email && (
                  <strong className='font-semibold'>{person.email}</strong>
                )}
                {person.email && person.phone && (
                  <div className='w-4 xl:flex justify-center items-center hidden before:inline-flex before:h-1 before:w-1 before:rounded-full before:bg-stone-200' />
                )}
                {person.phone && (
                  <strong className='font-semibold'>{person.phone}</strong>
                )}
              </div>
              {person.address && person.city && person.state && (
                <span className='text-stone-500'>
                  {person.address +
                    ', ' +
                    person.city.title +
                    ', ' +
                    person.state.title}
                </span>
              )}
            </div>
            {isLoggedProfile && (
              <Button
                href='/meu-perfil/editar'
                variant='secondary'
                borderRadius='full'
                className='font-bold'
              >
                Editar perfil
              </Button>
            )}
          </div>
          <div className='flex flex-row mt-8 w-60 justify-start gap-4'>
            {person.link_site && (
              <Link
                href={person.link_site}
                target='_blank'
                className='hover:bg-slate-100 rounded-full'
              >
                <Image
                  src={getVersionedImageUrl(internet)}
                  alt='Acessar website'
                  width={50}
                  height={50}
                />
              </Link>
            )}
            {person.link_twitter && (
              <Link
                href={person.link_twitter}
                target='_blank'
                className='hover:bg-slate-100 rounded-full'
              >
                <Image
                  src={getVersionedImageUrl(twitter)}
                  alt='Acessar twitter'
                  width={50}
                  height={50}
                />
              </Link>
            )}
            {person.link_instagram && (
              <Link
                href={person.link_instagram}
                target='_blank'
                className='hover:bg-slate-100 rounded-full'
              >
                <Image
                  src={getVersionedImageUrl(instagram)}
                  alt='Acessar instagram'
                  width={50}
                  height={50}
                />
              </Link>
            )}
            {person.link_linkedin && (
              <Link
                href={person.link_linkedin}
                target='_blank'
                className='hover:bg-slate-100 rounded-full'
              >
                <Image
                  src={getVersionedImageUrl(linkedin)}
                  alt='Acessar linkedin'
                  width={50}
                  height={50}
                />
              </Link>
            )}
          </div>
        </div>
      </div>
      {person.educations &&
        person.educations.map((academicStudy: any) => {
          return (
            <div
              className='bg-white rounded-2xl p-4 md:p-8 mt-8'
              key={academicStudy.id}
            >
              <span className='text-[18px] text-stone-600 font-bold'>
                Educação / Formação acadêmica
              </span>
              <div className='flex flex-col'>
                <span className='text-stone-800 text-base mt-5'>
                  Curso:{' '}
                  <span className='text-stone-400 font-medium'>
                    {academicStudy.course}
                  </span>
                </span>
                <span className='text-stone-800 text-base mt-5'>
                  Instituição:{' '}
                  <span className='text-stone-400 font-medium'>
                    {academicStudy.institution}
                  </span>
                </span>
                <span className='text-stone-800 text-base mt-5'>
                  Data de conclusão:{' '}
                  <span className='text-stone-400 font-medium'>
                    {academicStudy.conclusion_at}
                  </span>
                </span>
                <span className='text-stone-800 text-base mt-5'>
                  Situação Atual:{' '}
                  <span className='text-stone-400 font-medium'>
                    {currentSituation(academicStudy)}
                  </span>
                </span>
                <span className='text-stone-800 text-base mt-5'>
                  Observação:{' '}
                  <span className='text-stone-400 font-medium'>
                    {academicStudy.observation}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      {(person.full_description || person.curriculum) && (
        <div className='bg-white rounded-2xl p-4 md:p-8 mt-8'>
          {person.full_description && (
            <>
              <span className='text-[18px] text-stone-600 font-bold inline-block'>
                Descrição
              </span>
              <div
                className='text-stone-400 mt-5'
                dangerouslySetInnerHTML={{ __html: person.full_description }}
              />
            </>
          )}

          {person.curriculum && (
            <div className='w-96 mt-8'>
              <Button
                variant='primary'
                borderRadius='full'
                href={curriculumUrl}
                download
                target='_blank'
              >
                Baixar Currículum
              </Button>
            </div>
          )}
        </div>
      )}
      {showBackbutton && <BackButton />}
    </div>
  );
}
