const express = require('express');
const db = require('./db'); // Import db from db.js
const PORT = process.env.PORT || 9000;  
const indexRouter = require('./routes/index');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

app.use('/', indexRouter); 

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; 
