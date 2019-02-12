import React, { Component } from 'react';

class Searching extends Component {
    constructor(props){
        super(props);
    }


    render(){
        console.log(this.props);
        
        return(
            <div>
                <h1>Searching available</h1>
            </div>
        )
    }
}

export default Searching;