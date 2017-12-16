import React, { Component } from 'react';
import axios from 'axios';
import Map from './Map/Map';
import './App.css';


const KEY_IP_LOC = '02c1559982a189';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      initLoc: undefined
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
        initLoc: loc
      });
    })
    .catch( (err) => {
      console.log(err);
    })
  }

  render() {
    const { initLoc } = this.state;
    return (
      <div className="App">
        <Map initLoc={initLoc}/>
      </div>
    );
  }
}

export default App;
