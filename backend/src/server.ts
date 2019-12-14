import app from './app';

app.listen(process.env.PORT);

if (process.env.NODE_ENV !== 'production') {
  process.stdout.write(`restarted at ${new Date().toLocaleTimeString()}\n`);
  process.stdout.write(`http://localhost:${process.env.PORT}\n`);
}
