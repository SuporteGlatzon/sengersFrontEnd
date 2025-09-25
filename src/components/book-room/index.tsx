// In BookRoom component (book-room/index.tsx)

import { RoomProps } from '@/app/type/rooms.type';
import check from '@/assets/check.svg';
import { getVersionedImageUrl } from '@/utils/version-image';
import Image from 'next/image';
import Button from '../button';

type Props = {
  data: RoomProps[];
  isReverse: boolean;
};

export function BookRoom({ data, isReverse }: Props) {
  return (
    <div>
      {data.map((item, index) => (
        <div className='py-20' key={index}>
          <div
            className={`custom-container px-0 md:flex ${
              isReverse ? 'flex-row-reverse' : ''
            }`}
          >
            <div className='w-full'>
              {item.image && (
                <div className='w-full'>
                  <Image
                    src={getVersionedImageUrl(item.image)}
                    alt='Description of the image'
                    className='rounded-3xl mb-10'
                    width={1024}
                    height={1024}
                  />
                </div>
              )}
            </div>

            <div className='w-full flex justify-center flex-col p-10'>
              <span className='pb-2 text-secondary font-bold text-base max-[600px]:pt-[20px]'>
                {item.orange_text}
              </span>
              <strong className='pb-5 font-bold text-4xl'>{item.title}</strong>
              {item.description && (
                <div
                  className='mb-5'
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              )}

              {item.room &&
                item.room.map((roomItem, key) => (
                  <div className='flex flex-row py-2' key={key}>
                    <Image
                      src={check}
                      alt='Check icon'
                      className='object-contain'
                      width={25}
                      height={25}
                    />
                    <span className='pl-2 text-[18px] font-regular text-stone-500'>
                      {roomItem}
                    </span>
                  </div>
                ))}

              <div className='flex py-8'>
                {item.button_link && item.button_text && (
                  <div className='flex pb-8 pt-5'>
                    <Button
                      variant='primary'
                      borderRadius='full'
                      href={item.button_link}
                    >
                      {item.button_text}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
