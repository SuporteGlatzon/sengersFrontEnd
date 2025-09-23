import Button from '../button';

type Props = {
  data: {
    miniTitle: string;
    call: string;
    buttonText: string;
    link: string;
  };
  variant?: 'primary' | 'secondary';
};

const backgroundColor = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
};

export function CardForBusiness({ data, variant = 'primary' }: Props) {
  const cardClasses = `md:p-20 p-12 w-full ${backgroundColor[variant]} rounded-3xl text-white w-1/2 flex flex-col justify-between`;

  return (
    <div className={cardClasses}>
      <div className='flex flex-col justify-between'>
        <strong className='text-2xl font-medium'>{data.miniTitle}</strong>
        <h2 className='py-14 text-[48px] max-[600px]:text-[35px] max-[400px]:text-[30px] font-bold w-[465px] max-[600px]:w-[80%] max-[400px]:w-[100%] pr-8 leading-none'>
          {data.call}
        </h2>
      </div>
      <div className='flex'>
        <Button
          href={data.link}
          variant={variant === 'secondary' ? 'quarternary' : 'tertiary'}
          borderRadius='full'
          className='self-start'
        >
          {data.buttonText}
        </Button>
      </div>
    </div>
  );
}
