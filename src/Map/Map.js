import React, { Component } from 'react';
import L from 'leaflet';

import './Map.css'


export default class MapContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            markers: [ props.initLoc || [34.6000,-58.4500] ]
        }
    }

    render() {
        const { markers } = this.state;
        return <Map markers={markers}/>
    }
}



class Map extends Component {

    constructor(props) {
        super(props);

        this.state = {
            markerLayers: [],
        }
    }

    componentDidMount() {
        this.createMap();
    }

    componentWillReceiveProps(nextProps) {
        const markerLocs = this.state.markerLayers.map( (markLayer) => markLayer.getLatLng() );
        const newMarkerLocs = nextProps.markers;

        //const toRemove = markerLocs.filter( (markerLoc) => newMarkerLocs.includes())
    }

    createMap() {
        var { markers } = this.props;
        
        var map = L.map('mapid').setView( markers[0], 13);
        L.tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
            maxZoom: 20,
            attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        var popup = L.popup().setContent(`
        <div>
            <ul>
                <li class="contextMenuItem">Add location</li>
                <li class="contextMenuItem">asd</li>
            </ul>
        </div>
        `); 
        map.on('contextmenu',function(e){
            popup.setLatLng(e.latlng).openOn(map);
        });
        const markerLayers = markers.map( (mark) => L.marker(mark) );

        markerLayers.forEach( (markerLayer) => markerLayer.addTo(map) );
        this.setState({
            markerLayers: markerLayers
        });
    }

    render() {
        return (
            <div id="mapid"></div>            
        )
    }
}