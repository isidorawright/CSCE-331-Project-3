/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig

/*module.exports = {
  port: process.env.PORT,
  local_client_app: process.env.LOCAL_CLIENT_APP,
  remote_client_app: process.env.REMOTE_CLIENT_APP
}
*/
