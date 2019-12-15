import app from './app';

app.listen(process.env.PORT);

if (process.env.NODE_ENV !== 'production') {
  const time = new Date().toLocaleTimeString();
  const address = `http://localhost:${process.env.PORT}\n`;
  process.stdout.write(`started at ${time} at ${address}`);
}
