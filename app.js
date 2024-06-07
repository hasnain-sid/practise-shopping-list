const express = require('express');
const app = express();
const connectDB = require('./db/connect');
require('dotenv').config();
const tasks = require('./routes/tasks');
const notFound = require('./middleware/nod-found');
const erHandler = require('./middleware/err-handler');
// middleware
app.use(express.static('./public'));
app.use(express.json());

app.use('/api/v1/tasks',tasks)

app.use(notFound);
app.use(erHandler);
const port = process.env.PORT || 3000;


const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listining on port ${port}...`));
  }
  catch (err) {
    console.error(err);
  }
}

start();