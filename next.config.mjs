// next.config.js
module.exports = {
    reactStrictMode: true,
    trailingSlash: true, // Esto asegura que las rutas sean manejadas con un '/' al final
    async redirects() {
      return [
        {
          source: '/',
          destination: '/login', // Redirigimos la página principal al login
          permanent: true,
        },
      ];
    },
  };
  