import { AssociatesProps } from '@/app/type/associates.type';
import check from '@/assets/check.svg';
import { getVersionedImageUrl } from '@/utils/version-image';
import Image from 'next/image';
import Button from '../button';

const benefits = [
  'Plano de saúde',
  'Desconto nos cursos de qualificação',
  'Lorem ipsum dolor sit amet',
];
type Props = {
  data: AssociatesProps[];
};
export function BeAssociated({ data }: Props) {
  return (
    <>
      {data.map((item, index) => {
        return (
          <div
            className='custom-container px-0 flex py-20 flex-col'
            key={index}
          >
            <div>
              <span className='text-secondary font-bold'>
                {item.orange_text}
              </span>
              <h3 className='font-bold text-stone-800 text-4xl pt-3 pb-3'>
                {item.title}
              </h3>
              {item.description && (
                <div
                  className='text-lg font-regular text-stone-600 mb-16'
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              )}
            </div>
            <div
              className={`md:flex gap-10 ${
                index % 2 !== 0 ? 'flex-row-reverse' : ''
              }`}
            >
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
              <div className='w-full flex justify-center flex-col px-10'>
                <strong className='pb-5 font-bold text-stone-800 text-4xl'>
                  {item.title_right}
                </strong>
                {item.advantages &&
                  item.advantages.map((benefit, key) => {
                    return (
                      <div className='flex flex-row py-2' key={key}>
                        <Image
                          src={getVersionedImageUrl(check)}
                          alt='Description of the image'
                          className='object-contain'
                          width={28}
                          height={28}
                        />
                        <span className='pl-4 font-regular text-stone-500 text-[18px]'>
                          {benefit}
                        </span>
                      </div>
                    );
                  })}
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
        );
      })}
    </>
  );
}
