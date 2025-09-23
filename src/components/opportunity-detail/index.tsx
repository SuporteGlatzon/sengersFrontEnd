import { OpportunityProps } from '@/app/type/opportunity.type';
import getDate from '@/utils/date';
import { BackButton } from '../back-button';
import Button from '../button';
import Pill from '../pill';

type Props = {
  opportunity: OpportunityProps;
  backButtonHref: string;
  canEdit?: boolean;
};

export const OpportunityDetail = ({
  opportunity,
  backButtonHref,
  canEdit = false,
}: Props) => {
  function showStatus() {
    switch (opportunity.situation) {
      case 'approved':
        return 'Aprovado / Publicada';
      case 'pending':
        return 'Aguardando aprovação';
      case 'no_approved':
        return 'Não aprovada';
      case 'expired':
        return 'Expirada';
      default:
        return 'Candidatura efetuada';
    }
  }

  function showStatusVariant() {
    switch (opportunity.situation) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'no_approved':
        return 'danger';
      case 'expired':
        return 'neutral';
      default:
        return 'success';
    }
  }

  return (
    <div className='flex flex-col gap-6 items-center w-full'>
      <div className='bg-white flex flex-col p-4 md:p-8 border-white border-4 rounded-2xl w-full'>
        <span className='text-stone-400 text-sm'>
          Postado em {getDate(opportunity.date)}
        </span>
        <div className='py-4 w-full'>
          <Pill variant={showStatusVariant()}>
            <span className='font-bold text-[12px] text-primary'>
              {showStatus()}
            </span>
          </Pill>
        </div>
        <strong className='text-4xl'>{opportunity.title}</strong>
        <h2 className='font-semibold text-2xl'>{opportunity.company}</h2>
        <span className='text-stone-400 text-xl'>
          {opportunity.city.title}, {opportunity.state.letter}
        </span>
        <span className='text-stone-400'>Salário: {opportunity.salary}</span>
        <div className='flex flex-row'>
          <div className='bg-gray-200 w-fit pt-1 pb-1 pl-6 pr-6 mr-6 mt-6 mb-6'>
            <span className='font-bold text-base'>
              {opportunity.occupation_area.title}
            </span>
          </div>
          <div className='bg-gray-200 w-fit pt-1 pb-1 pl-6 pr-6 mr-6 mt-6 mb-6'>
            <span className='font-bold text-base'>
              {opportunity.type.title}
            </span>
          </div>
        </div>
        {canEdit && (
          <div className='flex py-4'>
            <Button
              variant='primary'
              borderRadius='full'
              href={`/minhas-oportunidades/${opportunity.id}/editar`}
            >
              Editar
            </Button>
          </div>
        )}
        <div className='flex flex-col pt-10'>
          <div
            dangerouslySetInnerHTML={{
              __html: opportunity.full_description as TrustedHTML,
            }}
          />
        </div>
      </div>
      <BackButton />
    </div>
  );
};
