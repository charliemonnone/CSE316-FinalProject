import React from 'react';
const Resizable = require('react-resizable').Resizable;



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
        this.setState({width: size.width, height: size.height}, () => {
            
        });
    };


    onMove = (event, newX, newY) => {
        event.stopPropagation();
        event.preventDefault();
        console.log('new x ' + newX)
        this.setState({x: newX, y: newY}, () => {
            this.props.updateDetails(this.state)
        });
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
    componentDidUpdate(prevProps, prevState) {
        if (this.props !== prevProps ) {
            this.setProperties()
        }
    }

    componentDidMount() {
        this.setProperties();
    }

    dragElement = (id, onMove) => {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let elmnt = document.getElementById(id);
        let left;
        let top;
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
            top = (elmnt.offsetTop - pos2)
            left = (elmnt.offsetLeft - pos1)
            console.log(left)
            elmnt.style.top = top + "px";
            elmnt.style.left = left + "px";
          
        }
      
        function closeDragElement(e) {

            let y = top
            // let y = top.split('px')[0]
            let x = left
            // let x = left.split('px')[0]
            onMove(e, x, y)
            document.onmouseup = null;
            document.onmousemove = null;
            elmnt.onmousedown = null;
            
        }
    }

    render() {
        let elementStyle = 'wireframe-control z-depth-1 ';
        const component = this.props.component;
        const controlStyle = "wireframe-" + component.type;
        elementStyle += controlStyle ;
        const elementId = this.props.id;
        let handles = []
        if(this.props.selected === elementId) {
            handles = ['sw', 'se', 'nw', 'ne']
            this.dragElement(elementId, this.onMove);
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
                innerValue = <input type="text" className="mock-input" disabled placeholder={component.value}/>
                break;
            default:
                break;
        }
        return(
            <Resizable id={elementId} onClick = {(e)=> this.props.select(e, elementId)} 
            height={this.state.height} width={this.state.width} onResize={this.onResize} onResizeStop={() => this.props.updateDetails(this.state)} resizeHandles={handles}
            className={"box " + elementStyle}>
                <div className={"box " + elementStyle} style={{width: this.state.width + 'px', height: this.state.height + 'px'}} >
                    {innerValue}
                </div>
            </Resizable>
        );
    }

}

export default WireframeControl;