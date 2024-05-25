import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, children, label }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal custom-scrollbar">
        <button className="close-btn" onClick={() => onClose(label)}>
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;
