import React from 'react';
import { ClockLoader } from 'react-spinners';

const Loader: React.FC<{ text?: string; children?: any }> = ({ text, children }) => {
  return (
    <div className='fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-white bg-opacity-50'>
      <div className='mr-2 h-10 w-10 animate-spin-slow'>o</div>
      <ClockLoader color='#000' size={50} />
      <div className='mr-2 h-10 w-10 animate-spin-slow'>o</div>
      {text && <span>{text}</span>}
      {children}
    </div>
  );
};

export default Loader;
