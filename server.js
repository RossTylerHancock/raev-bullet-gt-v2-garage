import { createRaevServer } from './server/app.js';

const port = Number.parseInt(process.env.PORT || '3000', 10);
const server = createRaevServer();

server.listen(port, '0.0.0.0', () => {
  console.log(`RAEV Garage listening on port ${port}`);
  console.log(`AI researcher: ${process.env.OPENAI_API_KEY ? 'configured' : 'not configured'}`);
});
