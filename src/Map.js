import React, { Component } from 'react';
import L from 'leaflet';

import './Map.css'


export default class Map extends Component {

    componentDidMount() {
        this.createMap();
    }

    createMap() {
        var { initialLocation } = this.props;
        initialLocation = initialLocation || [34.6000,-58.4500];
        
        var mymap = L.map('mapid').setView(initialLocation, 13);
        L.tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
            maxZoom: 20,
            attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mymap);

        var popup = L.popup().setContent('<p>Hello world!<br />This is a nice popup.</p>'); 
        mymap.on('contextmenu',function(e){
            popup.setLatLng(e.latlng).openOn(mymap);
        });
    }

    render() {
        return (
            <div id="mapid"></div>            
        )
    }
}