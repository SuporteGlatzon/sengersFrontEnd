import type { StaticImageData } from 'next/image';

export const getVersionedImageUrl = (
  url?: string | StaticImageData,
  version: string = '1'
): string => {
  if (!url) {
    console.warn(
      'Aviso: O URL da imagem não está definido, usando o avatar padrão.'
    );
    return '/default-avatar.png';
  }

  if (typeof url === 'string') {
    return `${url}?v=${version}`;
  } else if (typeof url === 'object' && 'src' in url) {
    return `${url.src}?v=${version}`;
  }

  console.error('Tipo de URL de imagem inválido:', url);
  return '/default-avatar.png';
};
