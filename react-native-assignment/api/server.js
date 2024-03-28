import Hapi from 'hapi';
import IP_ADDRESS from '../app/IP';
const server = new Hapi.Server({
  host: IP_ADDRESS,
  port: '8082',
  routes: {
    cors: { origin: ['*'] },
  },
});

async function main() {
  await server.register([{
    plugin: require('./shifts-mock-api'),
    routes: { prefix: '/shifts' },
  }]);

  await server.start();

  console.info(`✅  API server is listening at ${server.info.uri.toLowerCase()}`);
}

main();
