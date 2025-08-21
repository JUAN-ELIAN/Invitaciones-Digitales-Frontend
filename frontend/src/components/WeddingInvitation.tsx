import React, { useEffect, useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  format,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { useParams } from 'react-router-dom'; // Importar useParams
import Button from './Button';
import { RsvpFormModal } from './RsvpFormModal';
import { LuChurch } from 'react-icons/lu';
import { GiLinkedRings } from 'react-icons/gi';
import { PiGiftFill, PiCheersDuotone } from 'react-icons/pi';
import { GiMusicSpell } from 'react-icons/gi'; // Importar el nuevo icono de música
import { MdOutlinePlayCircle } from 'react-icons/md'; // Nuevo icono de play
import { FaCirclePause } from 'react-icons/fa6'; // Nuevo icono de pausa
import { GiftModal } from './GiftModal'; // Importar el nuevo modal de regalo

// Styled Components
const GiftIcon = styled.div`
  font-size: 3em; /* Tamaño similar al de los anillos */
  color: var(--color-accent-primary); /* Color de los botones */
  margin-bottom: 10px;
`;

const InvitationContainer = styled.div`
  background-color: var(--color-bg-primary);
  color: var(--color-text-secondary);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0; /* Eliminar padding horizontal para que los banners vayan de borde a borde */
  text-align: center;
  position: relative; /* Para posicionar arreglos florales como fondo */

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const HeaderBanner = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  margin-bottom: 20px;
  filter: brightness(1.1) contrast(1.05) saturate(1.2) blur(2.2px); /* Efecto de luz difuminado y cálido */

  @media (max-width: 768px) {
    max-height: 200px;
  }
`;

const Title = styled.h1`
  font-family: 'Dancing Script', cursive;
  color: var(--color-accent-primary);
  font-size: 5em;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 3em;
  }
`;

const Subtitle = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 1.2em;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 1em;
  }
`;

const RingsSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 20px; /* Espacio entre esta sección y la siguiente */
`;

const RingsIcon = styled.div`
  font-size: 3em; /* Tamaño un poco más grande para el icono de anillos */
  color: var(--color-accent-primary); /* Color de los botones */
  margin-bottom: 10px;
`;

const InvitationMessage = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 1.2em;
  margin-bottom: 20px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1em;
  }
`;

const LocationMessage = styled(InvitationMessage)`
  margin-bottom: 10px;
`;

const DateSection = styled.div`
  margin-top: 30px;
  font-family: 'Montserrat', sans-serif;
`;

const DateText = styled.p`
  font-size: 1.5em;
  margin-bottom: 5px;

  @media (max-width: 768px) {
    font-size: 1.2em;
  }
`;

const TimeText = styled.p`
  font-size: 2.5em;
  color: var(--color-accent-primary);
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 2em;
  }
`;

const CountdownContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap; // Allow items to wrap on smaller screens

  @media (max-width: 768px) {
    gap: 5px;
    flex-wrap: nowrap;
  }
`;

const CountdownItem = styled.div`
  background-color: #c0b8b0; /* Tono más oscuro para el box del contador */
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 100px; // Ensure a minimum width

  @media (max-width: 768px) {
    padding: 8px 10px;
    min-width: 70px;
  }
`;

const CountdownNumber = styled.span`
  font-size: 2em;
  font-weight: bold;
  color: var(--color-accent-primary);

  @media (max-width: 768px) {
    font-size: 1.2em;
  }
`;

const CountdownLabel = styled.span`
  display: block;
  font-size: 0.8em;
  text-transform: uppercase;
  color: var(--color-text-secondary);

  @media (max-width: 768px) {
    font-size: 0.6em;
  }
`;

const CountdownBanner = styled.div`
  width: 100%;
  background-color: rgba(
    220,
    214,
    207,
    0.7
  ); /* Revertido al color original con opacidad */
  padding: 30px 20px;
  margin-top: 20px; /* Espacio para que empiece después de la leyenda de la fecha */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LocationSection = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  min-width: 280px;
  gap: 6px;
`;

const LocationsRow = styled.div`
  width: 100%;
  display: flex;
  gap: 30px;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const LocationButton = styled(Button)`
  align-self: center;
  margin-top: 10px;
`;

const SectionHeading = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 1.1em;
  font-weight: 600;
  margin: 5px 0;
  color: var(--color-text-secondary);
`;

const SectionSubheading = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 1em;
  margin: 5px 0 10px 0;
  color: var(--color-text-secondary);
`;

const LocationIcon = styled.div`
  font-size: 2em;
  color: var(--color-accent-primary);
  margin-bottom: 10px;
`;

const AddressText = styled.p`
  font-size: 1.3em;
  font-weight: bold;
  margin-bottom: 20px;
  white-space: pre-line; // Allow line breaks
  text-align: center;
  line-height: 1.5;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1.1em;
  }
`;

const RsvpButton = styled(Button)`
  margin-top: 30px;
`;

const GiftSection = styled.div`
  width: 100%;
  background-color: rgba(
    220,
    214,
    207,
    0.7
  ); /* Color del banner del contador para consistencia */
  padding: 40px 20px;
  margin-top: 40px;
  box-sizing: border-box;
  text-align: center;
`;

const GiftMessage = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 1.2em;
  margin-bottom: 20px;
  text-align: center;
  color: var(--color-text-secondary);

  @media (max-width: 768px) {
    font-size: 1em;
  }
`;

interface ImageRotatorProps {
  imageSrc: string;
  transitionDuration?: number; // in ms
  opacity: number;
}

const ImageRotator: React.FC<ImageRotatorProps> = ({
  imageSrc,
  transitionDuration = 1000,
  opacity,
}) => {
  return (
    <ImageCubicle>
      <DynamicImage
        src={imageSrc}
        alt="Nuestros momentos"
        style={{
          opacity: opacity,
          transition: `opacity ${transitionDuration / 1000}s ease-in-out`,
        }}
      />
    </ImageCubicle>
  );
};

const AboutUsSection = styled.div`
  width: 100%;
  padding: 40px 20px;
  margin-top: 40px;
  text-align: center;
  box-sizing: border-box;
`;

const AboutUsTitle = styled.h2`
  font-family: 'Montserrat', sans-serif; /* Mismo estilo que AddressText */
  font-size: 1.8em;
  font-weight: bold;
  margin-bottom: 30px;
  color: var(--color-text-secondary);

  @media (max-width: 768px) {
    font-size: 1.5em;
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 columnas en pantallas grandes */
  gap: 15px; /* Espacio entre cubículos */
  max-width: 800px; /* Ancho máximo para la "cinta" */
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* 1 columna en móviles */
  }
`;

const ImageCubicle = styled.div`
  width: 100%;
  padding-bottom: 100%; /* Para mantener la proporción cuadrada */
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: var(
    --color-bg-secondary
  ); /* Color de fondo para los cubículos */
`;

const DynamicImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(1.1) contrast(1.05) saturate(1.05) blur(0.2px); /* Efecto de luz difuminado */
`;

const heartbeat = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0,0,0,0.2); }
  25% { transform: scale(1.06); box-shadow: 0 0 0 6px rgba(0,0,0,0.12); }
  40% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0,0,0,0.0); }
  60% { transform: scale(1.06); box-shadow: 0 0 0 6px rgba(0,0,0,0.12); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0,0,0,0.0); }
`;

const MusicControlContainer = styled.div<{ $playing: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--color-bg-secondary);
  padding: 10px;
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  animation: ${heartbeat} 1.4s ease-in-out infinite;
  animation-play-state: ${(p) => (p.$playing ? 'running' : 'paused')};
`;

const MusicIcon = styled.div`
  font-size: 1.5em;
  color: var(--color-accent-primary);
`;

const PlayPauseIcon = styled.div`
  font-size: 1.5em;
  color: var(--color-accent-primary);
  margin-left: 10px;
`;

const scrollVertical = keyframes`
  0% { transform: translateY(-50%); }
  100% { transform: translateY(0); }
`;

const FloralColumn = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 220px;
  overflow: hidden; /* Evitar que el track genere scroll fuera del contenedor */
  pointer-events: none;
  z-index: 1; /* Más visible que el fondo, detrás del contenido */
  @media (max-width: 992px) {
    width: 160px;
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

const FloralColumnLeft = styled(FloralColumn)`
  left: 0;
`;

const FloralColumnRight = styled(FloralColumn)`
  right: 0;
`;

const FloralTrack = styled.div<{ $playing: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  will-change: transform;
  animation: ${scrollVertical} 45s linear infinite;
  animation-play-state: ${(p) => (p.$playing ? 'running' : 'paused')};
`;

const FloralImg = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 12px;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2; /* Por encima de los arreglos florales */
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Footer = styled.footer`
  width: 100%;
  padding: 16px 12px;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.9em;
  opacity: 0.85;
`;

const INVITATION_DATA = {
  title: 'Nuestra Boda',
  names: 'Antonio y Vanesa',
  welcomeMessage: '¡No faltes en este día tan especial!',
  date: '2025-12-06T20:20:00',
  location:
    'Portugal 2300 1646, B1645BQH San Fernando, Provincia de Buenos Aires',
  googleMapsLink:
    'https://maps.google.com/?q=Portugal+2300+1646,+B1645BQH+San+Fernando,+Provincia+de+Buenos+Aires',
  partyLocation:
    'Fray Luis Beltrán 64, B1623 Maquinista Savio, Provincia de Buenos Aires',
  partyGoogleMapsLink:
    'https://maps.google.com/?q=Fray+Luis+Beltrán+64,+B1623+Maquinista+Savio,+Provincia+de+Buenos+Aires',
  music_url: '/waiting for the weekend (Remix).mp3',
};

const WeddingInvitation: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtener id de los parámetros de la URL
  const [invitation, setInvitation] = useState<any>(null); // Estado para almacenar los datos de la invitación
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);

  const allCarouselImages = [
    '/carrucel/WhatsApp Image 2025-08-11 at 18.55.06.jpeg',
    '/carrucel/WhatsApp Image 2025-08-11 at 18.55.50 (1).jpeg',
    '/carrucel/WhatsApp Image 2025-08-11 at 18.55.50 (2).jpeg',
    '/carrucel/WhatsApp Image 2025-08-11 at 18.55.50 (3).jpeg',
    '/carrucel/WhatsApp Image 2025-08-11 at 18.55.50.jpeg',
    '/carrucel/WhatsApp Image 2025-08-11 at 18.55.51 (1).jpeg',
    '/carrucel/WhatsApp Image 2025-08-11 at 18.55.51.jpeg',
    '/carrucel/WhatsApp Image 2025-08-11 at 18.55.52.png',
  ];

  const numCubicles = 4;
  // These constants are now defined outside the component or passed as props if needed
  // const transitionDuration = 1000; // 1 second for fade in/out
  // const displayDuration = 2000; // 2 seconds for image to be fully visible
  // const totalCycleTime = transitionDuration + displayDuration; // 3 seconds per image cycle

  const [currentImageIndices, setCurrentImageIndices] = useState<number[]>(
    Array.from({ length: numCubicles }, (_, i) => i)
  );
  const [opacities, setOpacities] = useState<number[]>(
    Array.from({ length: numCubicles }, () => 1)
  );

  const transitionDuration = 3000; // 3 second for fade in/out
  const displayDuration = 3000; // 3 seconds for image to be fully visible
  const totalCycleTime = transitionDuration + displayDuration; // 3 seconds per image cycle

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Initialize the state for each cubicle
    setCurrentImageIndices(Array.from({ length: numCubicles }, (_, i) => i));
    setOpacities(Array.from({ length: numCubicles }, () => 1));

    // Set up staggered transitions for each cubicle
    for (let i = 0; i < numCubicles; i++) {
      const cubicleDelay = i * (totalCycleTime / numCubicles); // Staggered start for each cubicle

      const initialTimer = setTimeout(() => {
        // This interval will handle the continuous cycling for this specific cubicle
        const interval = setInterval(() => {
          setOpacities((prevOpacities) => {
            const newOpacities = [...prevOpacities];
            newOpacities[i] = 0; // Start fading out this cubicle
            return newOpacities;
          });

          setTimeout(() => {
            setCurrentImageIndices((prevIndices) => {
              const newIndices = [...prevIndices];
              newIndices[i] =
                (newIndices[i] + numCubicles) % allCarouselImages.length; // Move to the next image in this cubicle's sequence
              return newIndices;
            });
            setOpacities((prevOpacities) => {
              const newOpacities = [...prevOpacities];
              newOpacities[i] = 1; // Fade in new image
              return newOpacities;
            });
          }, transitionDuration); // Wait for fade out to complete before changing image source and fading in
        }, totalCycleTime); // Each cubicle cycles every totalCycleTime

        timers.push(interval); // Store interval to clear later
      }, cubicleDelay); // Initial delay for this cubicle

      timers.push(initialTimer); // Store initial timer to clear later
    }

    return () => {
      timers.forEach((timer) => clearInterval(timer)); // Clear all timers on unmount
    };
  }, [
    allCarouselImages.length,
    numCubicles,
    totalCycleTime,
    transitionDuration,
  ]);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const response = await fetch(
          `https://invitaciones-digitales-backend.vercel.app/api/invitation/${id}`
        ); // Usar 'id'
        if (!response.ok) {
          throw new Error('Invitación no encontrada');
        }
        const data = await response.json();
        setInvitation(data);
      } catch (error) {
        console.error('Error al cargar la invitación:', error);
        // Manejar el error, quizás redirigir o mostrar un mensaje
      }
    };

    if (id) {
      // Usar 'id'
      fetchInvitation();
    }
  }, [id]); // Usar 'id'

  useEffect(() => {
    const eventDate = new Date(INVITATION_DATA.date); // Usar la fecha de INVITATION_DATA

    const updateCountdown = () => {
      const now = new Date();
      const totalSeconds = differenceInSeconds(eventDate, now);

      if (totalSeconds <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = differenceInDays(eventDate, now);
      const totalHours = differenceInHours(eventDate, now);
      const hours = totalHours % 24;
      const totalMinutes = differenceInMinutes(eventDate, now);
      const minutes = totalMinutes % 60;
      const seconds = totalSeconds % 60;

      setCountdown({ days, hours, minutes, seconds });
    };

    // Ejecutar inmediatamente
    updateCountdown();

    // Configurar el intervalo
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMapRedirect = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(INVITATION_DATA.location)}`;
    window.open(url, '_blank');
  };

  const handlePartyMapRedirect = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(INVITATION_DATA.partyLocation)}`;
    window.open(url, '_blank');
  };

  const renderAddress = (addr: string): React.ReactNode => {
    const province = 'Provincia de Buenos Aires';
    const subMarkers = ['B1645BQH San Fernando', 'B1623 Maquinista Savio'];
    const provinceIdx = addr.indexOf(province);
    if (provinceIdx !== -1) {
      const beforeProvince = addr
        .slice(0, provinceIdx)
        .trim()
        .replace(/,\s*$/, '');
      const foundSub = subMarkers.find((s) => beforeProvince.includes(s));
      if (foundSub) {
        const cityIdx = beforeProvince.indexOf(foundSub);
        const street = beforeProvince
          .slice(0, cityIdx)
          .trim()
          .replace(/,\s*$/, '');
        return (
          <>
            {street}, <br />
            {foundSub}, <br />
            {province}
          </>
        );
      }
      return (
        <>
          {beforeProvince},<br />
          {province}
        </>
      );
    }
    return addr;
  };

  useEffect(() => {
    let gestureHandler: ((e: Event) => void) | null = null;

    const tryAutoplay = async () => {
      if (!audioRef.current) return;
      try {
        audioRef.current.muted = false;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        try {
          // Intento 2: reproducir silenciado (permitido por policy)
          audioRef.current.muted = true;
          await audioRef.current.play();
          setIsPlaying(true);
          // Al primer gesto, quitar mute
          gestureHandler = () => {
            if (!audioRef.current) return;
            audioRef.current.muted = false;
            document.removeEventListener('pointerdown', gestureHandler as any);
          };
          document.addEventListener('pointerdown', gestureHandler as any, { once: true } as any);
        } catch (err2) {
          // Si también falla, esperar el primer gesto para reproducir con sonido
          gestureHandler = async () => {
            if (!audioRef.current) return;
            try {
              audioRef.current.muted = false;
              await audioRef.current.play();
              setIsPlaying(true);
            } catch {}
            document.removeEventListener('pointerdown', gestureHandler as any);
          };
          document.addEventListener('pointerdown', gestureHandler as any, { once: true } as any);
        }
      }
    };

    tryAutoplay();

    return () => {
      if (gestureHandler) document.removeEventListener('pointerdown', gestureHandler as any);
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.muted = false;
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRsvpSubmit = async (formData: any) => {
    if (!invitation || !invitation.id) {
      console.error('Error: invitation_id no disponible.');
      return;
    }

    try {
      const response = await fetch(
        'https://invitaciones-digitales-backend.vercel.app/api/rsvp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            invitation_id: invitation.id, // Usar el ID de la invitación cargada
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al registrar RSVP');
      }

      const result = await response.json();
      console.log('RSVP registrado con éxito:', result);
      alert('¡Confirmación de asistencia enviada con éxito!');
    } catch (error: any) {
      console.error('Error al enviar RSVP:', error.message);
      alert(`Error al enviar confirmación: ${error.message}`);
    }
  };

  return (
    <InvitationContainer>
      <FloralColumnLeft>
        <FloralTrack $playing={isPlaying}>
          {Array.from({ length: 8 }).map((_, i) => (
            <FloralImg key={`L1-${i}`} src="/carrucel/ArregloFloral_left.png" alt="" />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <FloralImg key={`L2-${i}`} src="/carrucel/ArregloFloral_left.png" alt="" />
          ))}
        </FloralTrack>
      </FloralColumnLeft>
      <FloralColumnRight>
        <FloralTrack $playing={isPlaying}>
          {Array.from({ length: 8 }).map((_, i) => (
            <FloralImg key={`R1-${i}`} src="/carrucel/ArregloFloral_right.png" alt="" />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <FloralImg key={`R2-${i}`} src="/carrucel/ArregloFloral_right.png" alt="" />
          ))}
        </FloralTrack>
      </FloralColumnRight>
      <ContentWrapper>
        <HeaderBanner
          src="/carrucel/Foto Encabezado.png"
          alt="Banner de Cabecera"
        />
        <Title>{INVITATION_DATA.title}</Title>
        <Title>{INVITATION_DATA.names}</Title>
        <Subtitle>{INVITATION_DATA.welcomeMessage}</Subtitle>
        <RingsSection>
          <RingsIcon>{GiLinkedRings({})}</RingsIcon>
          <InvitationMessage>
            ¡Tenemos el gusto de invitarte!
            <br />
            ¡En este día tan importante de nuestras vidas!
            <br />
            ¡Para celebrar nuestra unión!
          </InvitationMessage>
        </RingsSection>
        <CountdownBanner>
          <DateSection>
            <DateText>LA BODA SE CELEBRARÁ EL DÍA</DateText>
            <TimeText>
              {format(new Date(INVITATION_DATA.date), 'MMMM dd', {
                locale: es,
              }).toUpperCase()}{' '}
              a las {format(new Date(INVITATION_DATA.date), 'HH:mm')} horas
            </TimeText>
          </DateSection>
          <CountdownContainer>
            <CountdownItem>
              <CountdownNumber>{countdown.days}</CountdownNumber>
              <CountdownLabel>Días</CountdownLabel>
            </CountdownItem>
            <CountdownItem>
              <CountdownNumber>{countdown.hours}</CountdownNumber>
              <CountdownLabel>Horas</CountdownLabel>
            </CountdownItem>
            <CountdownItem>
              <CountdownNumber>{countdown.minutes}</CountdownNumber>
              <CountdownLabel>Minutos</CountdownLabel>
            </CountdownItem>
            <CountdownItem>
              <CountdownNumber>{countdown.seconds}</CountdownNumber>
              <CountdownLabel>Segundos</CountdownLabel>
            </CountdownItem>
          </CountdownContainer>
          <DateText>CÓDIGO DE VESTIMENTA, FORMAL ELEGANTE</DateText>
        </CountdownBanner>
        <InvitationMessage>
          ¡Gracias por acompañarnos en este momento tan importante! <br />
          Esperamos que seas parte de esta gran celebración. <br />
          ¡Confirma Tu Asistencia! <br />
          ¡Te esperamos!
        </InvitationMessage>
        <RsvpButton $primary onClick={() => setIsRsvpModalOpen(true)}>
          Confirmar Asistencia
        </RsvpButton>
        <LocationsRow>
          <LocationSection>
            <LocationIcon>{LuChurch({})}</LocationIcon>
            <LocationMessage>
              La ceremonia se celebrará en
              <br />
              La Parroquia Nuestra Señora de Itatí
              <br />
              a las 20:20 horas
              <br />
              {renderAddress(INVITATION_DATA.location)}
            </LocationMessage>
            <LocationButton $primary onClick={handleMapRedirect}>
              Como Llegar
            </LocationButton>
          </LocationSection>
          <LocationSection>
            <LocationIcon>{PiCheersDuotone({})}</LocationIcon>
            <LocationMessage>
              La Fiesta se celebrará en
              <br />
              La 5ta Eventos
              <br />
              a las 22:30 horas
              <br />
              {renderAddress(INVITATION_DATA.partyLocation)}
            </LocationMessage>
            <LocationButton $primary onClick={handlePartyMapRedirect}>
              Como Llegar
            </LocationButton>
          </LocationSection>
        </LocationsRow>

        <AboutUsSection>
          <AboutUsTitle>NOSOTROS</AboutUsTitle>
          <ImageGrid>
            {/* Cubículos de imágenes dinámicas */}
            {Array.from({ length: numCubicles }).map((_, i) => (
              <ImageRotator
                key={i}
                imageSrc={allCarouselImages[currentImageIndices[i]]}
                opacity={opacities[i]}
                transitionDuration={transitionDuration}
              />
            ))}
          </ImageGrid>
        </AboutUsSection>

        {/* Sección de Regalo */}
        <GiftSection>
          <GiftIcon>{PiGiftFill({})}</GiftIcon> {/* Nuevo icono de regalo */}
          <GiftMessage>
            Esperamos que seas parte de esta gran celebración.
            <br />
            Si deseas realizar un regalo, <br />
            podes colaborar con nuestra Luna de Miel
          </GiftMessage>
          <Button $primary onClick={() => setIsGiftModalOpen(true)}>
            Da tu Regalo
          </Button>
        </GiftSection>

        <MusicControlContainer onClick={toggleMusic} $playing={isPlaying}>
          <MusicIcon>{GiMusicSpell({})}</MusicIcon>
          <PlayPauseIcon>
            {React.createElement(
              isPlaying
                ? (FaCirclePause as React.ComponentType)
                : (MdOutlinePlayCircle as React.ComponentType)
            )}
          </PlayPauseIcon>
          <audio ref={audioRef} src={INVITATION_DATA.music_url} loop autoPlay preload="auto" playsInline />
        </MusicControlContainer>
        <RsvpFormModal
          isOpen={isRsvpModalOpen}
          onClose={() => setIsRsvpModalOpen(false)}
          onSubmit={handleRsvpSubmit}
        />
        <GiftModal
          isOpen={isGiftModalOpen}
          onClose={() => setIsGiftModalOpen(false)}
        />
        <Footer>© {new Date().getFullYear()} Digital Invitations — Todos los derechos reservados.</Footer>
      </ContentWrapper>
    </InvitationContainer>
  );
};

export default WeddingInvitation;
