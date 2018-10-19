import React from "react"
import { LineChart, Line, Tooltip, Legend, YAxis, CartesianGrid } from "recharts"
import openGdaxWebsocket from "../gdax-websocket"

class App extends React.Component {

  state = {
    tickerMessages: [],
    devChartMin: -1,
    devChartMax: 6000,
    priceAt24hOpening: 0
  }
  componentDidMount() {
    this.websocket = openGdaxWebsocket("BTC-EUR", this.handleNewTickerMessage)
  }

  componentWillUnmount() {
    this.websocket.close()
  }

  handleNewTickerMessage = newTickerMessage => {
    if (this.state.tickerMessages.length) {
      this.setState({
        devChartMin: parseInt(this.state.tickerMessages[0].low_24h - 10, 10),
        devChartMax: parseInt(this.state.tickerMessages[0].high_24h + 10, 10),
        priceAt24hOpening: parseFloat(this.state.tickerMessages[0].open_24h)
      })
    }

    this.setState(previousState => ({
      tickerMessages: previousState.tickerMessages.concat([newTickerMessage])
    }), () => console.log(this.state.tickerMessages))
  }

  trendUp = () => {
    if (this.state.tickerMessages.length) {
      return (this.state.tickerMessages[this.state.tickerMessages.length - 1].price >=
        this.state.priceAt24hOpening)
    } else {
      return <p>Loading...</p>
    }
  }

  render() {
    return (
      <div className="master-wrapper">
        <header className="header">
          <img className="header__image" src="./coin.png" alt="bitcoin" />
          <h1 className="header__title">
            SEE YOUR <span className="header__title--highlight">B</span>C<br />
            TRA<span className="header__title--highlight">C</span>K YA $TACK<br />
            <span className="header__title--highlight">CHART</span> WITH YOUR HEART
          </h1>

        </header>
        <section className="graph-container">
          <h2 className="graph-container__header">DEVELOPMENT</h2>
          <h2 className="graph-container__header">DEMAND</h2>
          <LineChart className="graph" width={400} height={400} data={this.state.tickerMessages}>
            <Tooltip />
            <Legend />
            <YAxis type="number" domain={[this.state.devChartMin, this.state.devChartMax]} />
            <Line type="monotone" dataKey="price" stroke="green" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="low_24h" stroke="purple" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="high_24h" stroke="pink" activeDot={{ r: 8 }} />
          </LineChart>

          <LineChart className="graph" width={400} height={400} data={this.state.tickerMessages}>
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis type="number" domain={["best_bid", "best_ask"]} />
            <Line type="basis" dataKey="price" stroke="green" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="best_ask" stroke="red" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="best_bid" stroke="blue" activeDot={{ r: 8 }} />
          </LineChart>
        </section>

        <section className="info-section">
          <div className="transactions-container">
            <h2>TRANSACTIONS:</h2>
            {this.state.tickerMessages.map(msg => (
              <div key={msg.sequence}>
                {msg.time}: <strong>{msg.price} EUR</strong>
              </div>
            ))}
          </div>

          <div className="trend-container">
            <h2>24H BITCOIN TREND:</h2>
            {this.state.tickerMessages.length > 1 &&
              <div>
                <p><strong>Opening:</strong> {this.state.priceAt24hOpening} EUR</p>
                <p><strong>Now:</strong>
                  {this.state.tickerMessages[this.state.tickerMessages.length - 1].price} EUR
                </p>

                {this.trendUp() ?
                  <img className="trend-container__image" alt="trend up" src="./happy2.png" /> :
                  <img className="trend-container__image" alt="trend down" src="./sad2.png" />
                }
              </div>
            }
          </div>

        </section>

      </div>
    )
  }

}

export default App
