import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from './Button'; // Importar el componente Button
import LoginModal from './LoginModal'; // Importar el componente LoginModal

const HeaderContainer = styled.header`
  width: 100%;
  background-color: #C0B8B0; /* Mismo color que el box del contador */
  padding: 15px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Sutilmente más oscuro para que coincida */
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  box-sizing: border-box;
  z-index: 1000;

  @media (max-width: 768px) {
    padding: 10px 15px;
  }
`;

const Logo = styled.h1`
  font-family: 'Dancing Script', cursive;
  color: var(--color-accent-primary);
  font-size: 1.8em;
  margin: 0;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 1.5em;
  }
`;

const NavButtons = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    gap: 5px;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownContent = styled.div<{ $show: boolean }>`
  display: ${(props) => (props.$show ? 'block' : 'none')};
  position: absolute;
  background-color: var(--color-bg-secondary);
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  right: 0;
  border-radius: 5px;
  overflow: hidden;
`;

const DropdownItem = styled.a`
  color: var(--color-text-secondary);
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;

  &:hover {
    background-color: var(--color-bg-primary);
  }
`;

const DropdownEmail = styled.div`
  padding: 12px 16px;
  text-align: center;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  color: var(--color-text-secondary);
`;

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado de autenticación
  const [userEmail, setUserEmail] = useState<string | null>(null); // Estado para almacenar el email del usuario
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); // Estado para controlar la visibilidad del modal de login
  const [loginModalInitialView, setLoginModalInitialView] = useState<'login' | 'register'>('login'); // Nuevo estado para controlar la vista inicial del modal
  const navigate = useNavigate(); // Hook para la navegación
  const location = useLocation(); // Hook para obtener la ubicación actual

  const updateUserStateFromToken = (token: string | null) => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload && payload.email) {
          setIsLoggedIn(true);
          setUserEmail(payload.email);
        } else {
          setIsLoggedIn(false);
          setUserEmail(null);
        }
      } catch (error) {
        console.error('Error al decodificar el token de sesión:', error);
        setIsLoggedIn(false);
        setUserEmail(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserEmail(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('sessionToken');
    updateUserStateFromToken(token);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'sessionToken') {
        updateUserStateFromToken(event.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLoginClick = () => {
    setLoginModalInitialView('login');
    setShowLoginModal(true);
  };

  const handleLoginSuccess = (sessionToken: string) => {
    localStorage.setItem('sessionToken', sessionToken);
    updateUserStateFromToken(sessionToken);
    setShowLoginModal(true);
    navigate('/my-invitations'); // Redirigir a la URL de la plantilla
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleRegisterClick = () => {
    setLoginModalInitialView('register');
    setShowLoginModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('sessionToken');
    setIsLoggedIn(false);
    setUserEmail(null);
    setShowDropdown(false);
    navigate('/'); // Redirigir a la página principal
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleMyInvitations = () => {
    navigate('/guest-management'); // Ahora navega a la página de gestión de invitados
    setShowDropdown(false);
  };

  const getTitle = () => {
    if (location.pathname === '/guest-management') {
      return 'Invitados';
    } else {
      return 'Nuestra Boda';
    }
  };

  return (
    <>
      <HeaderContainer>
        <Logo onClick={() => navigate('/')}>{getTitle()}</Logo>
        <NavButtons>
          {!isLoggedIn ? (
            <>
              <Button onClick={handleLoginClick} $primary>Iniciar Sesión</Button>
              <Button onClick={handleRegisterClick} $primary>Registrarse</Button>
            </>
          ) : (
            <DropdownContainer onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
              <Button $primary onClick={toggleDropdown} title={userEmail || 'Mi Cuenta'}>Mi Cuenta</Button>
              <DropdownContent $show={showDropdown}>
                {userEmail && <DropdownEmail>{userEmail}</DropdownEmail>}
                <DropdownItem onClick={handleMyInvitations}>Mis Invitaciones</DropdownItem>
                <DropdownItem onClick={handleLogout}>Cerrar Sesión</DropdownItem>
              </DropdownContent>
            </DropdownContainer>
          )}
        </NavButtons>
      </HeaderContainer>
      <LoginModal
        key={loginModalInitialView}
        $show={showLoginModal}
        onClose={handleCloseLoginModal}
        onLoginSuccess={handleLoginSuccess}
        initialView={loginModalInitialView}
      />
    </>
  );
};

export default Header;