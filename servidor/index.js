const express = require('express');
const routes = require('./src/routes');
const bodyParser = require('body-parser');
const cors = require('cors');

require('./src/database/database')

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(routes);

app.listen(3001, () => {
    console.log("Rodando na porta 3001");
})