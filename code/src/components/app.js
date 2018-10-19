import React from "react"
import openGdaxWebsocket from "../gdax-websocket"
import { LineChart, Line, Tooltip, Legend, YAxis, CartesianGrid } from 'recharts';

class App extends React.Component {

  state = {
    tickerMessages: [],
    chartMin: -1,
    chartMax: 6000,
    testData: [
      {name: 'Page A', myNumber: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', myNumber: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', myNumber: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', myNumber: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', myNumber: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', myNumber: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', myNumber: 0, pv: 4300, amt: 2100},
    ]
  }

  componentDidMount() {
    this.websocket = openGdaxWebsocket("BTC-EUR", this.handleNewTickerMessage)
  }

  componentWillUnmount() {
    this.websocket.close()
  }

  handleNewTickerMessage = newTickerMessage => {
    if (this.state.tickerMessages.length && (this.state.chartMin === -1)) {
      this.setState({
        chartMin: parseFloat(this.state.tickerMessages[0].low_24h  - 0.2),
        chartMax: parseFloat(this.state.tickerMessages[0].high_24h + 0.2)
      }, () => console.log("Daily low:", this.state.chartMin, "Daily high:", this.state.chartMax))
    }

    this.setState(previousState => ({
      tickerMessages: previousState.tickerMessages.concat([newTickerMessage])
    }), () => console.log(this.state.tickerMessages))
  }

  render() {

    return (
      <div>
        <LineChart width={400} height={400} data={this.state.tickerMessages}>
          <Tooltip />
          <Legend />
          <YAxis type="number" domain={[this.state.chartMin, this.state.chartMax]} />
          <Line type="monotone" dataKey="price" stroke="green" activeDot={{r: 8}} />
          <Line type="monotone" dataKey="low_24h" stroke="purple" activeDot={{r: 8}} />
          <Line type="monotone" dataKey="high_24h" stroke="pink" activeDot={{r: 8}} />
        </LineChart>

        <LineChart width={400} height={400} data={this.state.tickerMessages}>
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3"/>
          <YAxis type="number" domain={["best_bid", "best_ask"]} />
          <Line type="basis" dataKey="price" stroke="green" activeDot={{r: 8}} />
          <Line type="monotone" dataKey="best_ask" stroke="red" activeDot={{r: 8}} />
          <Line type="monotone" dataKey="best_bid" stroke="blue" activeDot={{r: 8}} />
        </LineChart>

        <div>
          {this.state.tickerMessages.map(msg => (
            <div key={msg.sequence}>
              {msg.time}: <strong>{msg.price} EUR</strong>
            </div>
          ))}
        </div>
      </div>
    )
  }

}

export default App
