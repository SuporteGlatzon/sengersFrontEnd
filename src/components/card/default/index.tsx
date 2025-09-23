import Pill from '@/components/pill';

import showIcon from '@/utils/icon';
import Link from 'next/link';
import { AiOutlineUser } from 'react-icons/ai';
import { BsArrowUpRight } from 'react-icons/bs';

type Props = {
  data: any;
  pageUrl?: string;
  isHomePage?: boolean;
  isOpportunityListPage?: boolean;
  isModalPage?: boolean;
  isMinhasConexoesPage?: boolean;
  isMinhasOportunidadesPage?: boolean;
};

export function DefaultCard({
  data,
  pageUrl = '/oportunidades',
  isHomePage = false,
  isOpportunityListPage = false,
  isModalPage = false,
  isMinhasConexoesPage = false,
  isMinhasOportunidadesPage = false,
}: Props) {
  const heigthClass =
    isOpportunityListPage ||
      isModalPage ||
      isMinhasConexoesPage ||
      isMinhasOportunidadesPage
      ? 'h-[305px]'
      : 'h-[300px]';

  if (!data.city) return null;

  if (
    isHomePage ||
    isOpportunityListPage ||
    isModalPage ||
    isMinhasConexoesPage ||
    isMinhasOportunidadesPage
  ) {
    return (
      <Link
        href={`${pageUrl}/${data.id}`}
        className={`bg-red-300 custom-box-small flex gap-5 group flex-col justify-between ${heigthClass}  max-[600px]:mb-0`}
      >
        <div className='flex w-full'>
          <div className='flex-1 flex flex-col'>
            <strong className='text-xl text-stone-700'>{data.company}</strong>
            <strong className='text-stone-400 font-normal'>
              {data.city.title} - {data.state.title}
            </strong>
            {isMinhasConexoesPage && (
              <div className='py-4 w-full'>
                <Pill variant={'success'}>Candidatura efetuada</Pill>
              </div>
            )}
            {isMinhasOportunidadesPage && (
              <div className='py-4 w-full'>
                <Pill variant={data.status.code}>{data.status.message}</Pill>
              </div>
            )}
          </div>
          {!isMinhasConexoesPage && (
            <div className='w-12 h-12 bg-stone-200 flex items-center justify-center text-lg text-white rounded-full group-hover:bg-secondary'>
              <BsArrowUpRight />
            </div>
          )}
        </div>

        <div className='w-full flex flex-col'>
          <strong className='text-2xl text-stone-800 group-hover:text-secondary'>
            {data.title}
          </strong>

          <span
            className='text-stone-500 text-base overflow-hidden max-h-[150px] line-clamp-3'
            dangerouslySetInnerHTML={{
              __html: data.description,
            }}
          />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`${pageUrl}/${data.id}`}
      className='custom-box-small flex gap-5 group'
    >
      <div className='flex flex-col w-full'>
        <div className='flex w-full'>
          <div className='flex-1 flex flex-col'>
            <strong className='text-lg text-stone-800'>{data.company}</strong>
            <strong className='text-stone-500 font-semibold text-lg'>
              {data.city.title} - {data.state.title}
            </strong>
          </div>
          {data.canditades.length > 0 ? (
            <div className='py-2 px-6 bg-primary text-white flex gap-2 items-center justify-center font-semibold text-lg rounded-full'>
              <AiOutlineUser />
              {data.canditades.length}
            </div>
          ) : (
            <div className='w-12 h-12 bg-stone-200 flex items-center justify-center text-lg text-white rounded-full group-hover:bg-secondary'>
              {showIcon(data.icon)}
            </div>
          )}
        </div>
        <div className='py-4'>
          <Pill variant={'success'}>{data.status.message}</Pill>
        </div>
        <div className='mt-10'>
          <strong className='text-lg text-stone-800 group-hover:text-secondary'>
            {data.title}
          </strong>
          <div className='text-stone-400 text-ellipsis overflow-hidden whitespace-nowrap'>
            {data.description}
          </div>
        </div>
      </div>
    </Link>
  );
}



