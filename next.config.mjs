// next.config.mjs
export default {
    reactStrictMode: true,  // Habilita el modo estricto de React para ayudar a identificar problemas potenciales
    trailingSlash: true,    // Asegura que todas las rutas sean manejadas con un '/' al final
  
    // Configuramos redirecciones automáticas
    async redirects() {
      return [
        {
          source: '/',          // Ruta raíz de la aplicación
          destination: '/login', // Redirigimos la raíz a la página de login
          permanent: true,       // Indicamos que esta redirección es permanente (HTTP 308)
        },
      ];
    },
  };
  