import React, { Component } from 'react';
import L, { Popup } from 'leaflet';

import './Map.css';


var markerIcon = L.icon({
    iconUrl: './images/map-markers/marker-icon.png',
    shadowUrl: './images/map-markers/marker-shadow.png',

    iconSize:    [25, 41],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize:  [41, 41]
});

var markerSecIcon = L.icon({
    iconUrl: './images/map-markers/marker-sec-icon.png',
    shadowUrl: './images/map-markers/marker-sec-shadow.png',

    iconSize:    [25, 41],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize:  [41, 41]
});


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


/**
 * This component is wierd/wrong because Leaflet methods manipulate the DOM too.
 * So it ends up being an hybrid between React and Leaflet (surely losing performance).
 */

class Map extends Component {

    constructor(props) {
        super(props);

        this.state = {
            map: undefined,
            markerLayers: [],
            floatingMarker: undefined
        }
    }

    componentDidMount() {
        this.createMap();
    }

    componentWillReceiveProps(nextProps) {
        const { map, markerLayers } = this.state;
        if (!map) return;
        const newMarkerLocs = nextProps.markers;
        const markerLocs = markerLayers.map( (markLayer) => {
            const objLoc = markLayer.getLatLng();
            return [ objLoc.lat, objLoc.lng ];
        } );

        const indexesToRemove = [];

        const toRemove = markerLocs.filter( (markerLoc, i) => newMarkerLocs.some( (newMark) => {
            return newMark[0]===markerLoc[0] && newMark[1]===markerLoc[1];
        }));
        const toAdd = newMarkerLocs.filter( (newMark) => markerLocs.every( (markerLoc) => {
            return markerLoc[0]!==newMark[0] && markerLoc[1]!==newMark[1];
        }));
        
        toRemove.forEach( (e) => map.removeLayer(e) );
        toAdd.forEach( (e) => L.marker(e).addTo(map) );
        
    }

    handleAddLocation() {
        console.log("ADD");
    }

    createMap() {
        const { markers } = this.props;
        
        const map = L.map('mapid').setView( markers[0], 13);
        L.tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
            maxZoom: 20,
            attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        const popup = L.popup().setContent(`
        <div>
            Content del popup<br>
            <button>Add destination</button>
        </div>
        `);

        map.on('click', (e) => {
            const { floatingMarker, map } = this.state;
            if ( floatingMarker ) {
                map.removeLayer(floatingMarker);
                this.setState({
                    floatingMarker: undefined
                });
            }
            else {
                const marker = new L.marker(e.latlng, { icon: markerSecIcon }).addTo(map);
                //popup.setLatLng(e.latlng).openOn(map);
                this.setState({
                    floatingMarker: marker
                });
            }
        });

        const markerLayers = markers.map( (mark) => L.marker(mark, {icon: markerIcon}) );
        markerLayers.forEach( (markerLayer) => markerLayer.addTo(map) );
        this.setState({
            map: map,
            markerLayers: markerLayers
        });
    }

    addMarker(loc) {
        const { markerLayers, map } = this.state;
        const newMarkerLayer = L.marker(loc, {icon: markerIcon}).addTo(map);
        this.setState({
            markerLayers: [ markerLayers, newMarkerLayer ],
            floatingMarker: undefined
        });
    }

    render() {
        const { floatingMarker } = this.state;
        if( floatingMarker ) {
            var floatingLoc = floatingMarker.getLatLng();
            floatingLoc = [ floatingLoc.lat, floatingLoc.lng];
        }
        return (
            <div>
                <div id="mapid"></div>
                { floatingMarker && 
                    <PopUp loc={floatingLoc} addLocation={this.addMarker.bind(this)}/>
                }
            </div>
        )
    }
}

class PopUp extends Component {

    handleAddLocation() {
        const { addLocation, loc } = this.props;
        addLocation(loc);
    }

    render() {
        const { loc, addLocation } = this.props;
        return (
            <div className="popUpContainer">
                <div>{`${loc[0]},${loc[1]}`}</div>
                <button onClick={this.handleAddLocation.bind(this)}>Add location</button>
            </div>
        )
    }
}