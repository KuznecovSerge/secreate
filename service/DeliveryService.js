const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(server);
const fs = require('fs');

let Entities=[];
const entitiesFile = './entities.json';

function getEntities(req, res) {
    res.status(200).send(Entities);
}

function getEntityOne(req, res) {
    const { id } = req.params;
    res.status(200).send(Entities[id-1]);
}

// отслеживаем изменения файла данных
fs.watchFile(entitiesFile, (curr, prev) => {
    try {
        const rawdata = fs.readFileSync(entitiesFile);
        Entities = JSON.parse(rawdata);    
    } catch (error) {
        console.log(error);
    }
});

app.use(cors());
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/entities', getEntities);
app.get('/entities/:id', getEntityOne);



io.on('connection', () => { /* … */ });
server.listen(9000, () => console.log(`Delivery Service listening at http://localhost:9000`));

