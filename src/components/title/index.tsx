type Props = {
  title: string;
  text: string;
};

function TitleSection({ title, text }: Props) {
  return (
    <div className='pt-16 pb-4'>
      <p className='text-sm md:text-lg text-stone-400 font-medium'>{title}</p>
      <strong className='text-lg md:text-4xl text-stone-800 font-bold mt-2 inline-block'>
        {text}
      </strong>
    </div>
  );
}

export default TitleSection;
