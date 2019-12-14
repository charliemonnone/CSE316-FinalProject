import React from 'react';
import WireframeControl from './WireframeControl';


class WireframeComponents extends React.Component {
    state = {
        components: []
    }
    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps !== prevState) {
            return {components: nextProps.components}
        }
        else return null;
    }

    render() {
        const components = this.props.components;
        if(!components) return <React.Fragment />
        console.log(components)
        return(
            <div>
                {components && components.map(component =>  {
                    return <WireframeControl component={component} key = {component.key} id = {component.key} updateDetails = {this.props.updateDetails}
                    selected = {this.props.selected} select = {this.props.select} deselect = {this.props.deselect}/>
                })}
            </div>
        );
    }
}

export default WireframeComponents