import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Button from './Button';
import { IoIosCopy } from 'react-icons/io';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 2000;
  overflow-y: auto;
`;

const ModalContent = styled.div`
  background-color: var(--color-bg-primary);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 350px;
  position: relative;
  margin: 5vh 0;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5em;
  color: var(--color-text-secondary);
  cursor: pointer;
`;

const FormTitle = styled.h2`
  font-family: 'Dancing Script', cursive;
  color: var(--color-accent-primary);
  text-align: center;
  margin-bottom: 20px;
`;

const BankDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 1.1em;
  color: var(--color-text-secondary);
`;

const CopyIcon = styled.span`
  cursor: pointer;
  margin-left: 10px;
  color: var(--color-accent-primary);
  font-size: 1em; /* Same size as text */
`;

const GiftModal: React.FC<GiftModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Copiado al portapapeles: ' + text);
      })
      .catch(err => {
        console.error('Error al copiar: ', err);
      });
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent ref={modalRef}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <FormTitle>Datos de Transferencia</FormTitle>
        <div>
          <BankDetail>
            <span>Titular: Gladys Vanesa Bejarano</span>
          </BankDetail>
          <BankDetail>
            <span>CBU: 4530000800011022236593</span>
            <CopyIcon onClick={() => copyToClipboard('4530000800011022236593')}>
              {IoIosCopy({})}
            </CopyIcon>
          </BankDetail>
          <BankDetail>
            <span>Alias: Bodavanesayantonio</span>
            <CopyIcon onClick={() => copyToClipboard('Bodavanesayantonio')}>
              {IoIosCopy({})}
            </CopyIcon>
          </BankDetail>
          <BankDetail>
            <span>CUIL: 27319658918</span>
          </BankDetail>
          <BankDetail>
            <span>Banco: Naranja X</span>
          </BankDetail>
        </div>
        <Button type="button" $success onClick={onClose} style={{ marginTop: '20px' }}>Gracias</Button>
      </ModalContent>
    </ModalOverlay>
  );
};

export { GiftModal };