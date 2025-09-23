type Props = {
  data: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
};

function HeadingProfile({ data }: Props) {
  return (
    <div className='pt-20'>
      <h1 className='text-stone-800 text-[66px] font-extrabold leading-none'>
        {data.name}
      </h1>
      <span className='font-bold text-stone-800 flex gap-7 pb-3 pt-6 text-[30px]'>
        <div>{data.email}</div>.<div>{data.phone}</div>
      </span>
      <div className='text-stone-400 font-bold text-xl'>{data.address}</div>
    </div>
  );
}

export default HeadingProfile;
