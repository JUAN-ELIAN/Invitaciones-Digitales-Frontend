import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from './Button';

// Define la interfaz para los datos de RSVP
interface Rsvp {
  names: string | string[]; // Puede ser un array o una cadena
  participants_count: number;
  email?: string;
  phone?: string;
  observations?: string;
  confirmed_attendance: boolean;
  not_attending: boolean;
}

interface GuestListTableProps {
  invitationId: string;
}

const TableContainer = styled.div`
  background-color: var(--color-bg-secondary);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin: 50px auto 30px auto; 
  max-width: 90%;
  overflow-x: auto; 
  @media (max-width: 768px) {
    padding: 10px;
    margin-top: 30px;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  th,
  td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    color: var(--color-text-secondary);
    @media (max-width: 768px) {
      padding: 8px 10px;
      font-size: 0.8rem;
    }
  }
  th {
    background-color: #f2f2f2;
    font-weight: bold;
    color: var(--color-text-primary);
  }
  tbody tr:hover {
    background-color: #f5f5f5;
  }
  // Estilo para filas alternas (impares)
  tbody tr:nth-child(odd) {
    background-color: #f9f9f9;
  }
`;

const TotalCount = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  color: var(--color-accent-primary);
  margin-top: 20px;
  text-align: right;
`;

// Nuevo componente para el título de la tabla
const StyledTitle = styled.h3`
  font-weight: bold;
  color: var(--color-text-primary);
`;

const DownloadButtonContainer = styled.div`
  margin-top: 20px;
  text-align: right;
`;

const GuestListTable: React.FC<GuestListTableProps> = ({ invitationId }) => {
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalParticipants, setTotalParticipants] = useState(0);

  useEffect(() => {
    const fetchRsvps = async () => {
      console.log('DEBUG (GuestListTable): Inicia carga de RSVPs para invitationId:', invitationId);
      const token = localStorage.getItem('sessionToken');
      if (!token) {
        console.error('DEBUG (GuestListTable): No se encontró token de sesión.');
        setError('No hay token de sesión.');
        setLoading(false);
        return;
      }
      
      try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}/api/rsvps/${invitationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al cargar la lista de invitados.');
        }

        const data = await response.json();
        
        console.log('DEBUG (GuestListTable): Respuesta de /api/rsvps:', data);
        if (data.rsvps) {
          console.log('DEBUG (GuestListTable): RSVPs recibidos:', data.rsvps.length, 'registros.');
        }

        setRsvps(data.rsvps || []);
        setTotalParticipants(data.participants_count || 0);

      } catch (err: any) {
        console.error('DEBUG (GuestListTable): Error en fetchRsvps:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log('DEBUG (GuestListTable): Carga de RSVPs finalizada. Loading:', false);
      }
    };
    fetchRsvps();
  }, [invitationId]);

  const handleDownload = () => {
    // Lógica para descargar Excel
    const headers = ['Nombres', 'Participantes', 'Email', 'Teléfono', 'Observaciones', 'Asistencia Confirmada'];
    const csvContent = headers.join(';') + '\n' + rsvps.map(e => {
      // Formatear los nombres para que se muestren como una cadena separada por comas
      let names = 'N/A';
      if (Array.isArray(e.names)) {
        names = e.names.join(', ');
      } else if (e.names) {
        try {
          const parsedNames = JSON.parse(e.names as string);
          if (Array.isArray(parsedNames)) {
            names = parsedNames.join(', ');
          } else {
            names = e.names;
          }
        } catch (error) {
          names = e.names;
        }
      }
      
      // Eliminar comillas dobles al inicio y final del string si existen
      names = names.replace(/^"|"$/g, '');

      return [
        `"${names}"`,
        e.participants_count,
        `"${e.email || 'N/A'}"`,
        `"${e.phone || 'N/A'}"`,
        `"${e.observations || 'N/A'}"`,
        `"${e.confirmed_attendance ? 'Sí' : 'No'}"`
      ].join(';');
    }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `invitados_evento_${invitationId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <TableContainer>Cargando invitados...</TableContainer>;
  }

  if (error) {
    return <TableContainer>Error al cargar la lista de invitados: {error}</TableContainer>;
  }

  return (
    <TableContainer>
      <StyledTitle>Invitados Confirmados ({totalParticipants} personas)</StyledTitle>
      {rsvps.length === 0 ? (
        <p>No hay invitados registrados para esta invitación.</p>
      ) : (
        <StyledTable>
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Cant.</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Observaciones</th>
              <th>Asistencia</th>
            </tr>
          </thead>
          <tbody>
            {rsvps.map((rsvp: Rsvp, index: number) => (
              <tr key={index}>
                <td>
                  {/* Lógica para manejar nombres como array o string JSON */}
                  {Array.isArray(rsvp.names) ? (
                    rsvp.names.map((name: string, i: number) => (
                      <div key={i}>{name}</div>
                    ))
                  ) : (
                    (() => {
                      try {
                        const parsedNames = JSON.parse(rsvp.names as string);
                        if (Array.isArray(parsedNames)) {
                          return parsedNames.map((name: string, i: number) => (
                            <div key={i}>{name}</div>
                          ));
                        }
                      } catch (e) {
                        // El formato no es un array JSON, lo renderizamos como string
                      }
                      return rsvp.names || 'N/A';
                    })()
                  )}
                </td>
                <td>{rsvp.participants_count}</td>
                <td>{rsvp.email || 'N/A'}</td>
                <td>{rsvp.phone || 'N/A'}</td>
                <td>{rsvp.observations || 'N/A'}</td>
                <td>{rsvp.confirmed_attendance ? 'Sí' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      )}
      <DownloadButtonContainer>
        <Button $primary onClick={handleDownload}>Descargar Excel</Button>
      </DownloadButtonContainer>
    </TableContainer>
  );
};

export default GuestListTable;