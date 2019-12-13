import React from 'react';
import { Rnd } from "react-rnd";
const Resizable = require('react-resizable').Resizable;
const ResizableBox = require('react-resizable').ResizableBox;


class WireframeControl extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            x : props.component.x_position,
            y : props.component.y_position,
            width: props.component.width,
            height: props.component.height,
            type: props.component.type,
            properties: props.component.properties,
            selected: null,
            cursors: "react-resizable-handle-sw react-resizable-handle-se react-resizable-handle-nw react-resizable-handle-ne"
        }
    }

    onResize = (event, {element, size, handle}) => {
        event.stopPropagation();
        this.setState({width: size.width, height: size.height});
    };

    setProperties = () => {
        let con = document.getElementById("wireframe-control-" + this.props.id);
        con.style.width = this.state.width + 'px';
        con.style.height = this.state.height + 'px';
        con.style.left = this.state.x + 'px';
        con.style.top = this.state.y + 'px';
        con.style.border = this.state.properties.border_thickness + 'px' + " solid " + this.state.properties.border_color;
        con.style.borderRadius = this.state.properties.border_radius + 'px';
        con.style.fontSize = this.state.properties.font_size + 'px';
        con.style.background = this.state.properties.background_color;
        con.style.color = "#424242"

        // maybe pass contraint values as props and restrict placement to within wireframe
        // handles are only for resizing but they also denote that the control is selected
        // should they always be a part of the rendered element and toggled on off?
    }

    componentDidMount() {
        this.setProperties();
    }

    render() {
        
        let elementStyle = 'wireframe-control z-depth-1 ';
        elementStyle += this.props.selected ? " selected " : " deselected ";
        const component = this.props.component;
        const controlStyle = "wireframe-" + component.type;
        elementStyle += controlStyle ;
        const elementId = "wireframe-control-"+ this.props.id;
        let innerValue;
        if(this.props.selected) {
        }
        switch(component.type) {
            case('label'):
            case('button'):
                innerValue = component.value
                break;
            case('container'):
                innerValue = String.fromCharCode(component.value)
                break;
            case('textfield'):
                innerValue = <input type="text" disabled placeholder={component.value}/>
                break;
        }
        return(
            <Rnd id={elementId} className = {elementStyle}
                size={{ width: this.state.width, height: this.state.height }}
                position={{ x: this.state.x, y: this.state.y }}
                onDragStop={(e, d) => {
                    this.setState({ x: d.x, y: d.y });
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                    this.setState({
                        width: ref.style.width,
                        height: ref.style.height,
                        ...position
                    });
                }}
                onClick = {(e)=> this.props.select(e, elementId)}
                >
                {innerValue}
            </Rnd>
        );
    }

}

export default WireframeControl;