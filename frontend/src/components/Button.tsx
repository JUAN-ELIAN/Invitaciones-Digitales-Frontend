import styled from 'styled-components';

interface ButtonProps {
  $primary?: boolean;
  $success?: boolean;
  $warning?: boolean;
}

const Button = styled.button<ButtonProps>`
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.1s ease;

  background-color: ${(props) =>
    props.$primary
      ? 'var(--color-accent-primary)'
      : props.$success
        ? 'var(--color-success)'
        : props.$warning
          ? 'var(--color-warning)'
          : 'transparent'};
  color: ${(props) => (props.$primary || props.$success || props.$warning ? 'white' : 'var(--color-accent-primary)')};
  border: ${(props) => (props.$primary || props.$success || props.$warning ? 'none' : '1px solid var(--color-accent-primary)')};

  &:hover {
    background-color: ${(props) =>
    props.$primary
      ? '#7a6a5e' /* Un tono más oscuro para el hover */
      : props.$success
        ? '#728273' /* Un tono más oscuro para el hover */
        : props.$warning
          ? '#c29f7a' /* Un tono más oscuro para el hover */
          : 'var(--color-bg-secondary)'};
    color: ${(props) => (props.$primary || props.$success || props.$warning ? 'white' : 'var(--color-text-secondary)')};
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 0.9em;
  }
`;

export default Button;