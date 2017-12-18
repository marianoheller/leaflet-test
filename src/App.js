import React, { Component } from 'react';
import axios from 'axios';
import Map from './Map/Map';
import Panel from './Panel/Panel';
import './App.css';


const KEY_IP_LOC = '02c1559982a189';
const KEY_GOOGLE_GEOLOC = 'AIzaSyDNc7O0ADgtJL8a2TojsvRGonJXUfSM5fo';


class AppContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      locs: [ undefined ]
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
      var { locs } = this.state;
      locs =  JSON.parse(JSON.stringify(locs));
      locs.shift();
      
      const initLoc = res.data.loc.split(",").map(Number);
      this.setState({
        locs: [ initLoc, ...locs ]
      });
    })
    .catch( (err) => {
      console.log(err);
    })
  }

  render() {
    const { locs } = this.state;
    return (
      <App  locs={locs}/>
    );
  }
}




class App extends Component {
  render() {
    const { locs } = this.props;
    return (
      <div className="App">
        <div className="columns is-gapless">
          <div className="column is-one-third">
            <Panel />
          </div>
          <div className="column is-two-thirds">
            <Map locs={locs}/>
          </div>
        </div>
      </div>
    );
  }
}

export default AppContainer;
