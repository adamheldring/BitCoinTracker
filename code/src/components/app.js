import React from "react"
import openGdaxWebsocket from "../gdax-websocket"

class App extends React.Component {

  state = {
    tickerMessages: []
  }

  componentDidMount() {
    this.websocket = openGdaxWebsocket("BTC-EUR", this.handleNewTickerMessage)
  }

  componentWillUnmount() {
    this.websocket.close()
  }

  handleNewTickerMessage = newTickerMessage => {
    this.setState(previousState => ({
      tickerMessages: previousState.tickerMessages.concat([newTickerMessage])
    }))
  }

  render() {
    return (
      <div>
        {this.state.tickerMessages.map(msg => (
          <div key={msg.sequence}>
            {msg.time}: <strong>{msg.price} EUR</strong>
          </div>
        ))}
      </div>
    )
  }

}

export default App
