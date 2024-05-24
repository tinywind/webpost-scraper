import React from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

export default function AppModal({ children, title, closeModal, apply }: { children: any; title: string; closeModal: () => void; apply?: () => void }) {
  return (
    <Modal
      isOpen={true}
      onRequestClose={closeModal}
      className='relative p-4 bg-white w-4/5 h-4/5 mx-auto my-12 rounded-lg shadow-lg overflow-auto'
      overlayClassName='fixed inset-0 bg-black bg-opacity-50'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-bold text-gray-700'>{title}</h2>
        <button onClick={closeModal} className='px-1 py-1 text-gray-800 rounded hover:text-gray-200'>
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
      <div className='mb-4'>{children}</div>
      {apply && (
        <div className='flex justify-end space-x-2'>
          <button onClick={apply} className='px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600'>
            적용
          </button>
        </div>
      )}
    </Modal>
  );
}
