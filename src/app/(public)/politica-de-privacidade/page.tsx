'use client';
import { SettingsProps } from '@/app/type/settings.type';
import { useSettings } from '@/hooks/useSettings';
import { useEffect, useState } from 'react';

function PoliticaDePrivacidade() {
  const settings = useSettings();
  const [policy, setPolicy] = useState<SettingsProps | null>(null);

  useEffect(() => {
    if (settings.length) {
      const foundPolicy = settings.find(
        (item) => item.key === 'privacy_policy'
      );
      setPolicy(foundPolicy ?? null);
    }
  }, [settings]);

  if (!policy) {
    return <p>Carregando política de privacidade...</p>;
  }

  return (
    <div className='custom-container custom-box page-politica'>
      <div dangerouslySetInnerHTML={{ __html: policy.value }} />
    </div>
  );
}

export default PoliticaDePrivacidade;
