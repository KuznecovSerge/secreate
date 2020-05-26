Тестовое задание для secreate.io

## TECH-Stack:
1. **front** - `Next.js`
2. **back** - `Node.js && pm2 - 3 services`


Первым делом, чтобы скачать проект, выполните в командной строке:

```bash
git clone https://github.com/KuznecovSerge/secreate.git
```

## 1. Запуск сервисов

Перейдите в каталог сервисов и запустите менеджер процессов pm2

```bash
cd secreate
cd services
pm2 start pm2.json
```

## 2. Запуск клиента

Удобней всего запустить dev-сервер для быстрого запуска клиента 

```bash
cd secreate
cd client
npm run dev
```

Проверьте работу приложения, перейдя по адресу http://localhost:3000/

Спасибо.
