type Props = {
  data: string;
};

function TagOpportunity({ data }: Props) {
  return (
    <span className='p-[10px] bg-stone-200 text-stone-700 font-semibold text-lg rounded-sm leading-none'>
      {data}
    </span>
  );
}

export default TagOpportunity;
