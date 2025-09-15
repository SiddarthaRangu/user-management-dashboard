const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

const userRoutes = require('./routes/users.js');

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});