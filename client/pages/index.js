import Head from 'next/head'
import Entities from '../components/Entities'
import axios from 'axios';

export default class Home extends React.Component {
  state = {
    entities: [],
    timerId: 0,
  }

  componentDidMount() {
    /* обновляем данные с сервиса раз в 5 секунд
    // (как вариант - можно сделать на сокетах по событию,
    //  тогда можно частично регулировать нагрузку на сервис 
    //  частотой отправки новых данных клиентам )
    */
    const refresh = this.refresh.bind(this);
    const timerId = setInterval(refresh, 5000);
    refresh();
    this.setState({ timerId });
  }

  refresh() {
    axios.get(`http://localhost:9000/entities`)
    .then(res => {
        const entities = res.data;
        this.setState({ entities });
    })
    .catch(error => console.log(error));
  }

  render() {
    const { entities } = this.state;
    return (
      <div className="container">
        <Head>
          <title>Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>

          <h1 className="title">
            Таблица сущностей
          </h1>

          <p className="description">
            Ниже вы можете выбрать аггрегатную функцию по столбцу
          </p>

          { entities.length && <Entities entities={entities}/> }

        </main>

        <footer>
          <a
            href="https://github.com/KuznecovSerge/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by Kuznecov Serge
          </a>
        </footer>

        <style jsx>{`
          .container {
            min-height: 100vh;
            padding: 0 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          main {
            padding: 5rem 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          footer {
            width: 100%;
            height: 100px;
            border-top: 1px solid #eaeaea;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          footer img {
            margin-left: 0.5rem;
          }

          footer a {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .title {
            margin: 0;
            line-height: 1.15;
            font-size: 2rem;
          }

          .title,
          .description {
            text-align: center;
          }

          .description {
            line-height: 1.5;
            font-size: 1.5rem;
          }

          .logo {
            height: 1em;
          }

        `}</style>

        <style jsx global>{`
          html,
          body {
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
              sans-serif;
          }

          * {
            box-sizing: border-box;
          }
        `}</style>
      </div>
    )
  }
}
