const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const data = [];
const timePeriod = 100; // интервал отправки - 10 раз в сек
const eCount = 20; // кол-во сущностей


app.get('/', (req, res) => res.send('I am external data source.'));
app.get('/data', getData);

// создаём и заполняем массив сущностей
function initData() {
    for (let e = 0; e < eCount; e++) {
        if (typeof data[e] !== 'object') {
            data[e] = { id: e + 1};
        }
        const entity = data[e];
        for(let p = 1; p <= 20; p++) {
            entity[`param${p}`] = Math.random() * 2 - 1;
        }
    }
}

/* Генерируем и отправляем данные сущностей */
function generateAndSendData() {
    for (const entity of data) {
        setTimeout(() => {
            Object.keys(entity).filter(k => k !=='id').forEach(key => {
                entity[key] = Math.random() * 2 - 1;
            });
            io.emit('message', entity);
            //console.log(entity.id);
        }, Math.random() * timePeriod * eCount);
    };
}

function getData(req, res) {
    return res.status(200).json(data);
}

initData();

/* Генерируем и отправляем данные - 10 раз в сек по одной сущности */
generateAndSendData(); // отправляем первую порцию сразу, а не ждём первого таймаута
setInterval( ()=> {
    generateAndSendData();
}, timePeriod * eCount );

io.on('connection', () => { /* … */ });
server.listen(4000, () => console.log(`App listening at http://localhost:4000`));
