import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Button from './Button';

interface RsvpFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RsvpFormData) => void;
}

interface RsvpFormData {
  names: string[];
  participants_count: number;
  email: string;
  phone?: string;
  observations?: string;
  confirmed_attendance: boolean;
  not_attending: boolean;
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
  align-items: flex-start; /* Align to top */
  z-index: 2000;
  overflow-y: auto; /* Allow overlay to scroll */
`;

const ModalContent = styled.div`
  background-color: var(--color-bg-primary);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  position: relative;
  margin: 5vh 0; /* Add some margin for top/bottom */
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

const FormGroup = styled.div`
  margin-bottom: 15px;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: var(--color-text-secondary);
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-bg-secondary);
  border-radius: 5px;
  font-size: 1em;
  background-color: white;
  color: var(--color-text-secondary);
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: var(--color-accent-primary);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-bg-secondary);
  border-radius: 5px;
  font-size: 1em;
  background-color: white;
  color: var(--color-text-secondary);
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: var(--color-accent-primary);
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 10px;
`;

const RsvpFormModal: React.FC<RsvpFormModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<RsvpFormData>({
    names: [''],
    participants_count: 1,
    email: '',
    phone: '',
    observations: '',
    confirmed_attendance: false,
    not_attending: false,
  });
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
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    // Control body scroll
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const currentNames = formData.names;
    const count = formData.participants_count;
    const newNames = Array.from({ length: count }, (_, i) => currentNames[i] || '');
    if (JSON.stringify(currentNames) !== JSON.stringify(newNames)) {
      setFormData(prev => ({ ...prev, names: newNames }));
    }
  }, [formData.participants_count, formData.names]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...formData.names];
    newNames[index] = value;
    setFormData(prev => ({ ...prev, names: newNames }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === 'confirmed_attendance') {
      setFormData(prev => ({ ...prev, confirmed_attendance: checked, not_attending: checked ? false : prev.not_attending }));
    } else if (name === 'not_attending') {
      setFormData(prev => ({ ...prev, not_attending: checked, confirmed_attendance: checked ? false : prev.confirmed_attendance }));
    }
  };

  const handleParticipantCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let count = parseInt(e.target.value, 10);
    if (isNaN(count) || count < 1) {
      count = 1;
    } else if (count > 10) {
      count = 10;
    }
    setFormData(prev => ({ ...prev, participants_count: count }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent ref={modalRef}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <FormTitle>Confirmar Asistencia</FormTitle>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="participants_count">Cantidad de participantes:</Label>
            <Input
              type="number"
              id="participants_count"
              name="participants_count"
              value={formData.participants_count}
              onChange={handleParticipantCountChange}
              min="1"
              max="10"
              required
            />
          </FormGroup>

          {formData.names.map((name, index) => (
            <FormGroup key={index}>
              <Label htmlFor={`name-${index}`}>{`Nombre del participante ${index + 1}`}</Label>
              <Input
                type="text"
                id={`name-${index}`}
                name={`name-${index}`}
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                required
              />
            </FormGroup>
          ))}
          <FormGroup>
            <Label htmlFor="email">Email:</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="phone">Teléfono (opcional):</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="observations">Observaciones (opcional):</Label>
            <TextArea
              id="observations"
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              rows={3}
            />
          </FormGroup>
          <CheckboxContainer>
            <Checkbox
              id="confirmed_attendance"
              name="confirmed_attendance"
              checked={formData.confirmed_attendance}
              onChange={handleCheckboxChange}
            />
            <Label htmlFor="confirmed_attendance">Confirmo mi asistencia</Label>
          </CheckboxContainer>
          <CheckboxContainer>
            <Checkbox
              id="not_attending"
              name="not_attending"
              checked={formData.not_attending}
              onChange={handleCheckboxChange}
            />
            <Label htmlFor="not_attending">No asistiré</Label>
          </CheckboxContainer>
          <Button type="submit" $success>Enviar</Button>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export { RsvpFormModal };