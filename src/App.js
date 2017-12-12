import React, { Component } from 'react';
import axios from 'axios';
import Map from './Map';
import './App.css';

const KEY_IP_LOC = '02c1559982a189';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      initialLocation: undefined
    }
  }

  componentDidMount() {
    this.getCurrentPosition();
  }

  getCurrentPosition() {
    axios.get('http://ipinfo.io', {
      params: {
        token: KEY_IP_LOC
      }
    })
    .then( (res) => {
      try {
        var loc = res.data.loc.split(",").map(Number);
      } catch(e) {
        console.log("Unable to parse ip location response");
        throw e;
      }
      this.setState({
        initialLocation: loc
      });
    })
    .catch( (err) => {
      console.log(err);
    })
  }

  render() {
    const { initialLocation } = this.state;
    return (
      <div className="App">
        <Map initialLocation={initialLocation}/>
      </div>
    );
  }
}

export default App;
