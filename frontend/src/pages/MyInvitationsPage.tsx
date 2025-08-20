import React, { useEffect, useState } from 'react';
import GuestListTable from '../components/GuestListTable';
import styled from 'styled-components';

// Define la interfaz para los datos de la invitación, ajusta según tu backend
interface Invitation {
  id: string;
  names: string;
  date: string;
  // Agrega más campos si es necesario
}

const PageContainer = styled.div`
  padding: 2rem;
  background-color: var(--color-bg-primary, #F4F2F0);
  display: flex;
  flex-direction: column;
  gap: 3rem; /* Aumenta el espacio entre las tablas de invitados */
`;

const InvitationSection = styled.div`
  /* Contenedor para cada invitación y su tabla de invitados */
  h2 {
    margin-bottom: 1rem;
    color: var(--color-accent-primary);
  }
`;

const MyInvitationsPage: React.FC = () => {
  // Cambiamos el estado para guardar un array de invitaciones
  const [invitations, setInvitations] = useState<Invitation[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInvitations = async () => {
      const token = localStorage.getItem('sessionToken'); 
      if (!token) {
        setError('No hay token de sesión. Por favor, inicia sesión.');
        setLoading(false);
        return;
      }

      try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
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

        const data: Invitation[] = await response.json();
        
        // Guardamos todo el array de invitaciones en el estado
        setInvitations(data); 

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
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

  // Si no hay invitaciones, muestra un mensaje
  if (invitations.length === 0) {
    return <PageContainer><p>No tienes invitaciones asociadas a tu cuenta. <a href="/crear-invitacion">¡Crea una ahora!</a></p></PageContainer>;
  }

  return (
    <PageContainer>
      {/* Mapea el array de invitaciones para renderizar una sección por cada una */}
      {invitations.map((inv) => (
        <InvitationSection key={inv.id}>
          {/* Muestra un título para cada invitación, por ejemplo, el nombre de la pareja */}
          <h2>Invitados para: {inv.names}</h2>
          {/* Renderiza el componente de la tabla de invitados, pasando el ID de la invitación actual */}
          <GuestListTable invitationId={inv.id} />
        </InvitationSection>
      ))}
    </PageContainer>
  );
};

export default MyInvitationsPage;
