const ioClient = require('socket.io-client');
const fs = require('fs');

const Entities=[];
const entitiesFile = './entities.json';

// Подключаемся к внешнему источнику данных
const socketClient = ioClient.connect('http://localhost:4000');
socketClient.on('connect', function () { 
    console.log("Connected to external data source"); 
});
socketClient.on('message', (data) => {
    //console.log(data.id);
    Entities[data.id - 1] = data;
    const rawdata = JSON.stringify(Entities);
    fs.writeFileSync(entitiesFile, rawdata);    
});


