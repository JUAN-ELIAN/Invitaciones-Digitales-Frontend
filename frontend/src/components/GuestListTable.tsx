import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from './Button';

interface GuestListTableProps {
  invitationId: string;
}

const TableContainer = styled.div`
  background-color: var(--color-bg-secondary);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin: 50px auto 30px auto; /* Aumentado el margen superior para bajar la tabla */
  max-width: 90%;
  overflow-x: auto; /* Permite el scroll horizontal en pantallas pequeñas */

  @media (max-width: 768px) {
    padding: 10px;
    margin-top: 30px; /* Ajuste para pantallas más pequeñas */
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
      padding: 8px 10px; /* Reducir padding en pantallas pequeñas */
      font-size: 0.9em; /* Reducir tamaño de fuente */
    }
  }

  th {
    background-color: var(--color-accent-primary);
    color: white;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9; /* Ligeramente diferente para alternar filas */
  }

  tr:hover {
    background-color: #f1f1f1;
  }
`;

const DownloadButtonContainer = styled.div`
  margin-top: 20px;
  text-align: right;
`;

const GuestListTable: React.FC<GuestListTableProps> = ({ invitationId }) => {
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRsvps = async () => {
      try {
        const response = await fetch(`https://invitaciones-digitales-backend.vercel.app/api/rsvps/${invitationId}`);
        if (!response.ok) {
          throw new Error('Error al cargar la lista de invitados.');
        }
        const data = await response.json();
        setRsvps(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (invitationId) {
      fetchRsvps();
    }
  }, [invitationId]);

  const handleDownload = async () => {
    try {
      const response = await fetch(`https://invitaciones-digitales-backend.vercel.app/api/rsvps/download/${invitationId}`);
      if (!response.ok) {
        throw new Error('Error al descargar el archivo.');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invitados_${invitationId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err: any) {
      console.error('DEBUG Frontend: Error al intentar descargar el Excel:', err.message);
      setError(err.message);
    }
  };

  if (loading) {
    return <TableContainer>Cargando lista de invitados...</TableContainer>;
  }

  if (error) {
    return <TableContainer>Error: {error}</TableContainer>;
  }

  return (
    <TableContainer>
      <h2>Lista de Invitados</h2>
      {rsvps.length === 0 ? (
        <p>No hay invitados confirmados aún.</p>
      ) : (
        <StyledTable>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Participantes</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Observaciones</th>
              <th>Confirmado</th>
            </tr>
          </thead>
          <tbody>
            {rsvps.map((rsvp) => (
              <tr key={rsvp.id}>
                <td>
                  {Array.isArray(rsvp.names) ? (
                    rsvp.names.map((name: string, i: number) => (
                      <div key={i}>{name}</div>
                    ))
                  ) : (
                    // Si no es un array, intentar parsear como JSON o mostrar directamente
                    (() => {
                      try {
                        const parsedNames = JSON.parse(rsvp.names);
                        if (Array.isArray(parsedNames)) {
                          return parsedNames.map((name: string, i: number) => (
                            <div key={i}>{name}</div>
                          ));
                        }
                      } catch (e) {
                        // No es JSON válido, mostrar como texto plano
                      }
                      return rsvp.names || 'N/A';
                    })()
                  )}
                </td>
                <td>{rsvp.participants_count}</td>
                <td>{rsvp.email}</td>
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
