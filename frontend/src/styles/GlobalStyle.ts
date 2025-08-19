import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --color-bg-primary: #F4F2F0; /* Beige muy claro y suave */
    --color-accent-primary: #917D6E; /* Marrón topo elegante */
    --color-text-secondary: #61564F; /* Marrón oscuro y cálido */
    --color-bg-secondary: #DCD6CF; /* Beige ligeramente más oscuro */
    --color-success: #8B9A8C; /* Verde oliva suave */
    --color-warning: #D9B48F; /* Tono terracota suave */
  }

  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif; /* Tipografía recomendada */
    background-color: var(--color-bg-primary);
    color: var(--color-text-secondary);
    /* Textura de papel sutil con transparencia */
    background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2361564F' fill-opacity='0.6' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E"); /* Aumentada la opacidad a 0.6 y color más oscuro */
    background-repeat: repeat;
    background-blend-mode: multiply; /* Mezcla la textura con el color de fondo */
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Dancing Script', cursive; /* Tipografía elegante y cursiva */
    color: var(--color-accent-primary);
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
  }
`;

export default GlobalStyle;