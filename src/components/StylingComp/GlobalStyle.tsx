import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
      overflow-x: hidden;
  }

  body {
  
     transition: background-color 0.5s ease, color 0.5s ease;
  }


  .column_content {
    
    .row {
     
      .mask {
        background-image: url("/pictures/joker.jpg");

        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        opacity: 100%;
        cursor: pointer;

         img {
           opacity: 0%;
         }
      }

      .div_on_click {
        margin: 2%;
        width: 107px;
        height: 107px;
      }
      
     }
  }

  
  .column_content .row .selected_Div_img {
    pointer-events: none;
  }
  
    .column_content .row .selected_Div_img img {
  opacity: 100%;
}

  .rotate-center {
    animation: rotate-center 0.2s ease-in-out both;
    box-shadow: 0px 0px 28px 29px rgba(255, 255, 0, 0.53);
  }

  .disabled{
  pointer-events: none;
  cursor: not-allowed;
}

  @keyframes rotate-center {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  
`;
