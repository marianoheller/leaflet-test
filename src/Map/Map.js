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
            map: null,
            markerLayers: [],
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
            <ul>
                <li class="contextMenuItem">Add location</li>
                <li class="contextMenuItem">asd</li>    
            </ul>
        </div>
        `);
        map.on('contextmenu', (e) => {
            popup.setLatLng(e.latlng).openOn(map);
            L.DomEvent.off(popup._contentNode);
            L.DomEvent.on(popup._contentNode, this.handleAddLocation.bind(this));
        });
        const markerLayers = markers.map( (mark) => L.marker(mark) );

        markerLayers.forEach( (markerLayer) => markerLayer.addTo(map) );
        this.setState({
            map: map,
            markerLayers: markerLayers
        });
    }

    render() {
        return (
            <div id="mapid"></div>            
        )
    }
}