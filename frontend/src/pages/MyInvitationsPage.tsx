import React, { useEffect, useState } from 'react';
import GuestListTable from '../components/GuestListTable';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 2rem;
  background-color: var(--color-bg-primary, #F4F2F0);
`;

const MyInvitationsPage: React.FC = () => {
  const [invitationId, setInvitationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInvitations = async () => {
      const token = localStorage.getItem('sessionToken'); // Asumiendo que el token se guarda aquí

      if (!token) {
        console.log('DEBUG: No se encontró token de sesión en localStorage.');
        setError('No hay token de sesión. Por favor, inicia sesión.');
        setLoading(false);
        return;
      }
      console.log('DEBUG: Token de sesión encontrado:', token);

      try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        const url = `${API_BASE_URL}/api/my-invitations`;
        console.log('DEBUG: Intentando conectar a la URL:', url);
        const response = await fetch(`${API_BASE_URL}/api/my-invitations`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al cargar las invitaciones del usuario.');
        }

        const data = await response.json();
        console.log('DEBUG: Respuesta del backend /api/my-invitations:', data);
        if (Array.isArray(data) && data.length > 0) { // Verificar si se recibió un array y no está vacío
          setInvitationId(data[0].id); // Tomar el ID de la primera invitación
          console.log('DEBUG: invitationId establecido:', data[0].id);
        } else {
          setError('No se encontraron invitaciones para este usuario.');
          console.log('DEBUG: No se encontraron invitaciones para el usuario.');
        }
      } catch (err: any) {
        console.error('DEBUG: Error en fetchUserInvitations:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log('DEBUG: Carga de invitaciones finalizada. Loading:', false);
      }
    };

    fetchUserInvitations();
  }, []);

  if (loading) {
    return <PageContainer>Cargando tus invitaciones...</PageContainer>;
  }

  if (error) {
    return <PageContainer>Error: {error}</PageContainer>;
  }

  return (
    <PageContainer>
      {invitationId ? (
        <GuestListTable invitationId={invitationId} />
      ) : (
        <p>No tienes invitaciones asociadas a tu cuenta.</p>
      )}
    </PageContainer>
  );
};

export default MyInvitationsPage;
