import {createPortal} from 'react-dom';

import "./ConfirmationModal.css";


interface Props {
    children: React.ReactNode;
}

export default function ConfirmationModal({ children }: Props) {
    return createPortal(
      <div className="modal-container">
        <div className="modal-content">
          {children}
        </div>
      </div>,
      document.getElementById('modal') as Element
    );
  }