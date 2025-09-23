import express from 'express';
import router from './routes/busRoutes.js';

const app = express();
app.use(express.json());
app.use('/', router);

// Add a test route to see if the server is working
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working', routes: ['/busBook', '/busBlock', '/busSearch'] });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log('- GET /test');
  console.log('- POST /busBook');
  console.log('- POST /busBlock');
  console.log('- POST /busSearch');
});

