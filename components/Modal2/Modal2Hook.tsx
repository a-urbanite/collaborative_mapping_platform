import React, { useRef } from 'react';
import Modal2 from './Modal2';

function useModal2() {
  const modalRef = useRef(null as unknown as any);

  return {
    Modal2: React.forwardRef( function MyComponent(props, ref) {
       return <Modal2 {...props} ref={modalRef} />
    }),  // forwardRef lets your component expose a DOM node to parent component with a ref.
    modalRef,
  };
}

export default useModal2;
