import { io } from './server';

io.on('connection', client => {
  client.on('event', data => { });
  client.on('disconnect', () => { });
});
