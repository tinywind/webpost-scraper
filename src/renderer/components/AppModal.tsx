import React from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faCheck } from '@fortawesome/free-solid-svg-icons';

export default function AppModal({ children, title, closeModal, apply }: { children: any; title: string; closeModal: () => void; apply?: () => void }) {
  return (
    <Modal
      shouldCloseOnOverlayClick={false}
      isOpen={true}
      onRequestClose={closeModal}
      className='flex flex-col relative bg-white w-4/5 h-4/5 mx-auto my-12 rounded-lg shadow-lg'
      overlayClassName='fixed inset-0 bg-black bg-opacity-50'>
      <div className='flex justify-between items-center mb-4 p-4'>
        <h2 className='text-lg font-bold text-gray-700'>{title}</h2>
        <button onClick={closeModal} className='px-1 py-1 text-sm text-gray-800 rounded hover:text-gray-200'>
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
      <div className='flex-grow overflow-auto mb-4'>
        <div className='px-4'>{children}</div>
      </div>
      {apply && (
        <div className='mt-auto flex justify-end space-x-2 p-4'>
          <button onClick={apply} className='w-full py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600'>
            <FontAwesomeIcon icon={faCheck} />
          </button>
        </div>
      )}
    </Modal>
  );
}
