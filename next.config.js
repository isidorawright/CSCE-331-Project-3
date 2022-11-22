const withLess = require("next-with-less");


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

// next.config.js

module.exports = withLess({
  lessLoaderOptions: {
    /* ... */
  },
});

/*module.exports = {
  port: process.env.PORT,
  local_client_app: process.env.LOCAL_CLIENT_APP,
  remote_client_app: process.env.REMOTE_CLIENT_APP
}
*/
