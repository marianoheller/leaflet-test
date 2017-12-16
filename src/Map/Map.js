import React, { Component } from 'react';
import L, { Popup } from 'leaflet';
import 'leaflet-easybutton';

import 'bulma/css/bulma.css';
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
            markers: props.initLoc ? [ props.initLoc ] : []
        }
    }

    componentWillReceiveProps(nextProps) {
        if( !nextProps.initLoc ) return;
        this.setState({
            markers: [ nextProps.initLoc ]
        })
    }

    render() {
        const { markers } = this.state;
        if (!markers.length) return <div>Error loading map. No initial location.</div>
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


    createMap() {
        const { markers } = this.props;
        
        const map = L.map('mapid').setView( markers[0], 13);
        L.tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
            maxZoom: 17
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
                this.setState({
                    floatingMarker: marker
                });
            }
        });

        var helloPopup = L.popup().setContent('Hello World!');

        const markerLayers = markers.map( (mark) => L.marker(mark, {icon: markerIcon}) );
        markerLayers.forEach( (markerLayer) => markerLayer.addTo(map) );

            
        L.easyButton('<span class="star">&starf;</span>', (btn, map) => {
            const { markerLayers } = this.state;
            const group = new L.featureGroup(markerLayers);
            map.fitBounds(group.getBounds().pad(0.1));
        }).addTo( map );

        this.setState({
            map: map,
            markerLayers: markerLayers
        });
    }

    addMarker(loc) {
        const { markerLayers, map } = this.state;
        const newMarkerLayer = L.marker(loc, {icon: markerIcon}).addTo(map);

        //Zoom to fit every marker after adding
        const group = new L.featureGroup( [ ...markerLayers, newMarkerLayer ]);
        map.fitBounds(group.getBounds().pad(0.1));

        this.setState({
            markerLayers: [ ...markerLayers, newMarkerLayer ],
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
            <div className="mapContainer">
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
            <div className="popUpContainer columns">
                <div className="popUp column is-4 is-offset-4">
                    <div>{`${loc[0]},${loc[1]}`}</div>
                    <button onClick={this.handleAddLocation.bind(this)}>Add location</button>
                </div>
            </div>
        )
    }
}