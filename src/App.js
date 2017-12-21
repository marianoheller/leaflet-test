import React, { Component } from 'react';
import axios from 'axios';
import Map from './Map/Map';
import MapPopup from './Map/MapPopup';
import Panel from './Panel/Panel';
import './App.css';


const KEY_IP_LOC = '02c1559982a189';
const KEY_GOOGLE_GEOLOC = 'AIzaSyDNc7O0ADgtJL8a2TojsvRGonJXUfSM5fo';


class AppContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      locs: [],
      floatingLoc: undefined
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
      const initLoc = res.data.loc.split(",").map(Number);
      this.setState({
        locs: [ initLoc, ...locs ]
      });
    })
    .catch( (err) => {
      console.log(err);
    })
  }

  setFloatLoc(loc) {
    this.setState({
      floatingLoc: loc
    })
  }

  addLoc(loc) {
    this.setState({
      locs: [ ...this.state.locs, loc ],
      floatingLoc: undefined
    })
  }

  removeLoc(index) {
    this.setState({
      locs: this.state.locs.splice(index, 1)
    })
  }

  render() {
    const { locs, floatingLoc } = this.state;
    return (
      <App  
      locs={locs}
      floatingLoc={floatingLoc}
      locHelpers={{
        add: this.addLoc.bind(this),
        remove: this.removeLoc.bind(this),
        setFloater: this.setFloatLoc.bind(this)
      }}
      />
    );
  }
}




class App extends Component {
  render() {
    const { locs, locHelpers, floatingLoc } = this.props;

    return (
      <div className="App">
        <div className="columns is-gapless">
          <div className="column is-one-third">
            <Panel locs={locs} locHelpers={locHelpers} />
          </div>
          <div className="column is-two-thirds">
            <Map locs={locs} locHelpers={locHelpers} floatingLoc={floatingLoc} />
            <MapPopup loc={floatingLoc} locHelpers={locHelpers} />
          </div>
        </div>
      </div>
    );
  }
}

export default AppContainer;
