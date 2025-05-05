// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import App from './App.jsx';

const theme = extendTheme({
    colors: {
        brand: {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#818cf8',
            500: '#6366f1',
            600: '#4f46e5',
            700: '#4338ca',
            800: '#3730a3',
            900: '#312e81'
        }
    },
    fonts: {
        heading: 'Poppins, system-ui, sans-serif',
        body: 'Inter, system-ui, sans-serif'
    },
    styles: {
        global: {
            body: {
                bg: 'gray.50',
                color: 'gray.800',
                _dark: {
                    bg: 'gray.900',
                    color: 'white'
                }
            }
        }
    },
    components: {
        Button: {
            defaultProps: {
                colorScheme: 'brand'
            }
        }
    }
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <App />
        </ChakraProvider>
    </React.StrictMode>
);