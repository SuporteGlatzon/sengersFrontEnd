'use client';

import { useState } from 'react';
import Select from 'react-select';

type Option = {
  value: string;
  label: string;
};

const options: Option[] = [
  { value: 'item1', label: 'item1' },
  { value: 'item2', label: 'item2' },
  { value: 'item3', label: 'item3' },
];

function Filter() {
  const [city, setCity] = useState<Option | null>(null);
  const [state, setState] = useState<Option | null>(null);
  const [tags, setTags] = useState<Option[]>([]);

  const handleClearFilters = () => {
    setCity(null);
    setState(null);
    setTags([]);
  };

  return (
    <div>
      <div className='flex justify-between'>
        <h1 className='text-md font-bold'>
          Filtrar <span className='text-secondary'>Empresas</span>
        </h1>
        <button
          className='text-red-600 font-bold text-sm cursor-pointer'
          onClick={handleClearFilters}
        >
          Limpar Filtros
        </button>
      </div>
      <div className='flex gap-5 text-lg font-semibold pt-7  flex-col md:flex-row'>
        <div className='flex-1'>
          <label className='pb-2 block'>Cidade</label>
          <Select
            placeholder='Selecione...'
            id='city'
            options={options}
            value={city}
            onChange={(selectedOption) => setCity(selectedOption)}
          />
        </div>
        <div className='flex-1'>
          <label className='pb-2 block'>Estado</label>
          <Select
            placeholder='Selecione...'
            id='state'
            options={options}
            value={state}
            onChange={(selectedOption) => setState(selectedOption)}
          />
        </div>
        <div className='w-full md:w-1/2'>
          <label className='pb-2 block'>Tags *</label>
          <Select
            isMulti
            placeholder='Selecione...'
            options={options}
            value={tags}
            onChange={(selectedOption) => setTags(selectedOption as Option[])}
          />
        </div>
      </div>
    </div>
  );
}

export default Filter;
