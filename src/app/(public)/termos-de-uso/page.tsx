'use client';

import { SettingsProps } from '@/app/type/settings.type';
import { useSettings } from '@/hooks/useSettings';
import { useEffect, useState } from 'react';

function TermosDeUso() {
  const settings = useSettings();
  const [terms, setTerms] = useState<SettingsProps | null>(null);

  useEffect(() => {
    if (settings.length) {
      const foundTerms = settings.find((item) => item.key === 'terms_of_use');
      setTerms(foundTerms ?? null);
    }
  }, [settings]);

  if (!terms) {
    return <p>Carregando termos de uso...</p>;
  }

  return (
    <div className='custom-container custom-box page-termos-uso'>
      <div dangerouslySetInnerHTML={{ __html: terms.value }} />
    </div>
  );
}

export default TermosDeUso;
