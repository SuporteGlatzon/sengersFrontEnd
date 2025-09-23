import { StaticImageData } from 'next/image';

export type CompanyType = {
  image: string | StaticImageData;
  name: string;
  city: string;
  state: string;
  segment: string;
  address?: string;
  description?: string;
};
