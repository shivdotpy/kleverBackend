const express = require('express');
const app = express();
const http = require('http').createServer(app);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const PORT = process.env.PORT || 5000;

const userRoutes = require('./src/routes/user.routes');

app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

mongoose.connect('mongodb://localhost:27017/klever', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});

app.use(express.static('public'));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => {
	res.send('Klever API is working');
});

app.use('/api/user/', userRoutes);

http.listen(PORT);
