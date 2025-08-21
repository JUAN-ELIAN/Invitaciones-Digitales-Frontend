import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Button from './Button';

interface LoginModalProps {
  $show: boolean;
  onClose: () => void;
  onLoginSuccess: (sessionToken: string) => void;
  initialView?: 'login' | 'register';
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: var(--color-bg-secondary);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: var(--color-text-secondary);

  &:hover {
    color: var(--color-accent-primary);
  }
`;

const Title = styled.h2`
  color: var(--color-accent-primary);
  margin-bottom: 20px;
  font-family: 'Dancing Script', cursive;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: var(--color-text-secondary);
  font-size: 0.9em;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  background-color: var(--color-bg-primary);
  color: var(--color-text-secondary);

  &:focus {
    outline: none;
    border-color: var(--color-accent-primary);
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.8em;
  margin-top: 10px;
`;

const ToggleViewLink = styled.p`
  margin-top: 20px;
  font-size: 0.9em;
  color: var(--color-text-secondary);
  cursor: pointer;

  span {
    color: var(--color-accent-primary);
    text-decoration: underline;
  }

  &:hover span {
    color: var(--color-accent-secondary);
  }
`;

const LoginModal: React.FC<LoginModalProps> = ({ $show, onClose, onLoginSuccess, initialView = 'login' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isRegisterView, setIsRegisterView] = useState(initialView === 'register');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsRegisterView(initialView === 'register');
  }, [initialView]);

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

    if ($show) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [$show, onClose]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('https://invitaciones-digitales-backend.vercel.app/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar la solicitud.');
      }

      setMessage(data.message || 'Solicitud de registro enviada con éxito.');
      setEmail('');
      setPassword('');
      // Opcional: cambiar a vista de login después de enviar la solicitud
      // setIsRegisterView(false); 
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('https://invitaciones-digitales-backend.vercel.app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, access_token: accessToken }), // Usar email, password y access_token
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el inicio de sesión.');
      }

      // Asumiendo que el backend devuelve un 'token' de sesión JWT
      localStorage.setItem('sessionToken', data.token); 
      onLoginSuccess(data.token); // Pasar el sessionToken
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!$show) {
    return null;
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>{isRegisterView ? 'Solicitar Acceso' : 'Iniciar Sesión'}</Title>

        {message && <p style={{ color: 'green', marginBottom: '15px' }}>{message}</p>}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {isRegisterView ? (
          // Formulario de Registro
          <form onSubmit={handleRegister}>
            <InputGroup>
              <Label htmlFor="registerEmail">Email</Label>
              <Input
                type="email"
                id="registerEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="registerPassword">Contraseña</Label>
              <Input
                type="password"
                id="registerPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputGroup>
            <Button type="submit" $success>Solicitar Acceso</Button>
            <ToggleViewLink onClick={() => setIsRegisterView(false)}>
              ¿Ya tienes una cuenta? <span>Iniciar Sesión</span>
            </ToggleViewLink>
          </form>
        ) : (
          // Formulario de Login
          <form onSubmit={handleLogin}>
            <InputGroup>
              <Label htmlFor="loginEmail">Email</Label>
              <Input
                type="email"
                id="loginEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="loginPassword">Contraseña</Label>
              <Input
                type="password"
                id="loginPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="accessToken">Token de Plantilla</Label>
              <Input
                type="text"
                id="accessToken"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                required
              />
            </InputGroup>
            <Button type="submit" $success>Ingresar</Button>
            <ToggleViewLink onClick={() => setIsRegisterView(true)}>
              ¿No tienes una cuenta? <span>Solicitar Acceso</span>
            </ToggleViewLink>
            <ToggleViewLink onClick={() => alert('Funcionalidad de recuperar clave no implementada.')}>
              <span>Recuperar Clave</span>
            </ToggleViewLink>
            <ToggleViewLink onClick={() => alert('Funcionalidad de recuperar token no implementada.')}>
              <span>Recuperar Token</span>
            </ToggleViewLink>
          </form>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoginModal;