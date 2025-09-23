'use client';
import { useRouter } from 'next/navigation';
import Button from '../button';

type Props = {
  href?: string;
  className?: string;
};

const ButtonInner = () => {
  return (
    <>
      <svg
        viewBox='0 0 15 26'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='w-2'
      >
        <path
          d='M1.68628 11.5859L0.272095 13L1.68628 14.4143L13 25.728L14.4142 24.3137L3.10046 13L14.4142 1.68628L13 0.271973L1.68628 11.5859Z'
          fill='currentColor'
        />
      </svg>
      Voltar
    </>
  );
};

export const BackButton = ({ href, className = '' }: Props) => {
  const router = useRouter();

  if (!href) {
    return (
      <Button
        onClick={() => router.back()}
        borderRadius='full'
        variant='tertiary'
        className={`${className} self-center mt-8`}
      >
        <ButtonInner />
      </Button>
    );
  }

  return (
    <Button
      href={href}
      borderRadius='full'
      variant='tertiary'
      className={`${className} self-center mt-8`}
    >
      <ButtonInner />
    </Button>
  );
};
