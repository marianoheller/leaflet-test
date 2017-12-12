import React, { Component } from 'react';
import L from 'leaflet';

import './Map.css'


export default class Map extends Component {

    componentDidMount() {
        this.createMap();
    }

    createMap() {
        
        const mymap = L.map('mapid').setView([51.505, -0.09], 13);
         L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mymap);
/*         var map = new L.Map("mapid", {center: [37.8, -96.9], zoom: 3})
        .addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")); */
    }

    render() {
        return (
            <div id="mapid"></div>            
        )
    }
}