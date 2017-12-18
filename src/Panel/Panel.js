import React, { Component } from 'react';
import geocoder from 'geocoder';


export default class Panel extends Component {

    render() {
        
        return (
            <div id="panelContainer">
                <div className="column is-12">
                    PANEL TITLE!
                    <InputLocation />
                    <ListMarkers locs={this.props.locs}/>
                </div>
            </div>
        )
    }
}


class InputLocation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            suggestions: []
        }

        this.getSuggestions = debounce( this.getSuggestions.bind(this), 750);
    }

    handleInputChange(e) {
        const { value } = e.target;
        if( value.length > 3) this.getSuggestions(e.target.value);
        
    }
    
    getSuggestions(val) {
        geocoder.geocode(val, ( err, data ) => {
            if(err) return;
            this.setState({
                suggestions: data.results.map( (result) => result.formatted_address)
            })
        });
    }

    render() {
        const { suggestions } = this.state;
        return (
            <div>
                <div className="field">
                    <div className="control">
                        <input list="inputLocs" 
                        className="input is-primary" 
                        type="text" 
                        placeholder="Enter location or coords"
                        onChange={this.handleInputChange.bind(this)} 
                        />
                        { suggestions.length > 0 && 
                        <datalist id="inputLocs">
                            { suggestions.map( (suggestion) => <option key={suggestion} value={suggestion} />)}
                        </datalist>
                        }
                        
                    </div>
                </div>
            </div>
        )
    }
}


function debounce(callback, wait, context = this) {
    let timeout = null 
    let callbackArgs = null
    
    const later = () => callback.apply(context, callbackArgs)
    
    return function() {
      callbackArgs = arguments
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
}


class ListMarkers extends Component {

    render() {
        const locs = this.props.locs || ["default message for no locations"];
        return (
            <aside className="menu">            
                <ul className="menu-list">
                    { locs.map( (loc, i) => <li key={`marker${i}`}>{loc}</li>)}
                </ul>
            </aside>
        )
    }
}


