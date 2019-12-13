import React from 'react';
import WireframeControl from './WireframeControl';


class WireframeComponents extends React.Component {
    render() {
        console.log(this.props.components)
        const components = this.props.components;
        if(!components) return <React.Fragment />
        return(
            <div>
                {components && components.map(component =>  {
                    return <WireframeControl component={component} key = {component.key} id = {component.key} 
                    selected = {this.props.selected} select = {this.props.select} deselect = {this.props.deselect}/>
                })}
            </div>
        );
    }
}

export default WireframeComponents