import { ReactElement } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';

type Props = {
  text: string;
  icon: ReactElement;
};

function ButtonsPanel({ text, icon }: Props) {
  return (
    <div className='group p-5 cursor-pointer hover:bg-secondary rounded-2xl flex items-center hover:text-white'>
      <div className='w-[50px] h-[50px] rounded-full bg-stone-100 text-stone-900 group-hover:bg-white p-4 mr-5'>
        {icon}
      </div>
      <div className='flex justify-between w-full'>
        {text}
        <HiOutlineArrowNarrowRight className='mt-2' />
      </div>
    </div>
  );
}

function ConfigProfileCard() {
  return (
    <div className='flex gap-5 bg-white rounded-2xl p-[30px] flex-col text-stone-800 font-bold'>
      <ButtonsPanel text='Ver Perfil' icon={<AiOutlineUser size={20} />} />

      <ButtonsPanel
        text='Minhas candidaturas'
        icon={<AiOutlineUser size={20} />}
      />
    </div>
  );
}

export default ConfigProfileCard;
