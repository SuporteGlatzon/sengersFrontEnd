'use client';

import { OpportunityType } from '@/app/type/opportunity.type';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../button';
import { Modal } from '../modal';

type Props = {
  opportunity: OpportunityType;
};

export default function ModalMyOpportunity({ opportunity }: Props) {
  const [openModal, setOpenModal] = useState(false);
  const searchParams = useSearchParams();

  function handleModal() {
    setOpenModal(!openModal);
  }

  useEffect(() => {
    if (searchParams.get('modal') === 'efetuar-candidatura') {
      setOpenModal(true);
    }
  }, [searchParams]);

  return (
    <>
      <Button variant='primary' borderRadius='full' onClick={handleModal}>
        Quero me candidatar
      </Button>
      {openModal && <Modal opportunity={opportunity} callback={handleModal} />}
    </>
  );
}
