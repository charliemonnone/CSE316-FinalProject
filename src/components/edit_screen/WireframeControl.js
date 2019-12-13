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
        }
    }

    onResize = (event, {element, size, handle}) => {
        event.stopPropagation();
        event.preventDefault();
        this.setState({width: size.width, height: size.height});
    };

    onMove = (newX, newY) => {
        this.setState({x: newX, y: newY});
    }

    setProperties = () => {
        let con = document.getElementById( this.props.id);
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

    dragElement = (id) => {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let elmnt = document.getElementById(id);
        elmnt.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          document.onmousemove = elementDrag;
        }
      
        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
          elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
          
        }
      
        function closeDragElement() {
          document.onmouseup = null;
          document.onmousemove = null;
          elmnt.onmousedown = null;
        }
      }

    render() {
        
        let elementStyle = 'wireframe-control z-depth-1 ';
        elementStyle += this.props.selected ? " selected " : " deselected ";
        const component = this.props.component;
        const controlStyle = "wireframe-" + component.type;
        elementStyle += controlStyle ;
        const elementId = this.props.id;
        let handles = []
        if(this.props.selected == elementId) {
            let top = document.getElementById(this.props.selected).style.top;
            let left = document.getElementById(this.props.selected).style.left;
            let y = top.split('px')[0]
            let x = left.split('px')[0]
            
            if(x != this.state.x || y != this.state.y) this.onMove(x, y)
            handles = ['sw', 'se', 'nw', 'ne']
            this.dragElement(elementId);
        } 
        let innerValue;
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
            <Resizable id={elementId} onClick = {(e)=> this.props.select(e, elementId)} 
            height={this.state.height} width={this.state.width} onResize={this.onResize} resizeHandles={handles}
            className={"box " + {elementStyle}}
             >
                <div className="box" style={{width: this.state.width + 'px', height: this.state.height + 'px'}} >
                    {innerValue}
                </div>
            </Resizable>
        );
    }

}

export default WireframeControl;