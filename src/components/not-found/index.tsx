type Props = {
  title: string;
  text: string;
};

export const NotFoundBox = ({ title, text }: Props) => {
  return (
    <div className='pb-4 bg-white rounded-2xl text-center p-8 min-h-[400px] flex items-center justify-center flex-1'>
      <div>
        <strong className='text-lg md:text-4xl text-stone-800 font-bold inline-block'>
          {title}
        </strong>
        <p className='text-sm md:text-lg text-stone-400 mt-5'>{text}</p>
      </div>
    </div>
  );
};
