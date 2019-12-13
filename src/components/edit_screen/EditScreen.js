import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemsList from './ItemsList.js';
import Wireframe from './Wireframe.js';
import { updateEditTime } from '../../store/database/asynchHandler';
import { firestoreConnect } from 'react-redux-firebase';

class EditScreen extends Component {
    
    constructor(props) {
        super(props);
        let diagram = props.location.state.diagram;
        const id = props.id;
        props.updateEditTime(id);
        this.state = {
            name: diagram.diagram_name,
            width: diagram.wireframe.width,
            height: diagram.wireframe.height,
            editDim: 'disabled',
            transform: 0.9,
            components: diagram.components,
            selected: null
        }
    }
    
    componentDidMount = () => {
        const { diagram } = this.props.location.state
        this.setState({
            width: diagram.wireframe.width,
            height: diagram.wireframe.height,
        });
        document.addEventListener('keydown',(e) => this.handleKeyDown(e))
    }

    handleNewComponent = (e, type) => {
        let cmps = this.state.components;
        let newComponent = {
            key: this.state.components.length,
            type: '',
            value: '',
            x_position: 0,
            y_position: 0,
            width: 100,
            height: 100,
            properties: {
                font_size: 14,
                background_color: "#FFFFFF",
                border_color: "#000000",
                border_thickness: 1,
                border_radius: 3
            }
        }
        switch(type) {
            case 'container':
                newComponent.type = type;
                newComponent.value = "&nbsp;";
                break;
            case 'label':
                newComponent.type = type;
                newComponent.value = "I am a label";
                break;
            case 'button':
                newComponent.type = type;
                newComponent.value = "Submit";
                break;
            case 'textfield':
                newComponent.type = type;
                newComponent.value = "Input";
                break;
            default:
                break;

        }
        console.log(newComponent)
        cmps.push(newComponent);
        this.setState({components: cmps});

    }

    handleKeyDown = (e) => {
        e.stopImmediatePropagation();
        if (e.keyCode == 68 && e.ctrlKey) {
            if(this.state.selected != undefined) {
                console.log("in")
                let duplicate = document.getElementById(this.state.selected).cloneNode();
                let cmps = this.state.components;
                let comp = cmps[duplicate.id]
                let clone = Object.assign({}, comp)
                clone.key = cmps.length;
                cmps.push(clone)
                this.setState({components: cmps});
            }
        }
        if (e.keyCode == 46) {
            if(this.state.selected) {
                let element = document.getElementById(this.state.selected);
                console.log(element.id)
                let cmps = this.state.components;
                cmps.splice(element.id, 1);
                console.log(cmps)
                this.setState({components: cmps});
            }
        }
    }

    deleteComponent = (e) => {
        e.stopImmediatePropagation();   
        if (e.keyCode == 46) {
            console.log("delete")
            if(this.state.selected) {
                let element = document.getElementById(this.state.selected);
                let cmps = this.state.components;
                cmps.splice(element.id, 1);
                // let comp = cmps[element.id]
                // let clone = Object.assign({}, comp)
                // clone.key =  cmps.length + 1;
                // cmps.push(clone)
                this.setState({components: cmps});
            }
        }
    }

    duplicateComponent = (e) => {
        e.stopImmediatePropagation();
        if (e.keyCode == 68 && e.ctrlKey) {
            if(this.state.selected) {
                let duplicate = document.getElementById(this.state.selected).cloneNode();
                let cmps = this.state.components;
                let comp = cmps[duplicate.id]
                let clone = Object.assign({}, comp)
                clone.key =  cmps.length + 1;
                cmps.push(clone)
                this.setState({components: cmps});
            }
        }
    }
    goHome = () => {
        this.props.history.push('/ ');
    }

    handleEditDim = () => {
        let newStyle = 'toolbar-btn-color';
        this.setState({editDim: newStyle})
    }

    handleEditName = () => {
        const n = document.getElementById('name_field');
        this.setState({name: n.value})
    }

    handleChangeDimension = (e) => {
        const w = document.getElementById('width_field');
        if(w.value === '') w.value = this.state.width; 
        const h = document.getElementById('height_field');
        if(h.value === '') h.value = this.state.height; 
        this.setState({
            width: Math.min(Math.max(w.value, 10), 1000),
            height: Math.min(Math.max(h.value, 10), 580),
            editDim: 'disabled'
        });
        w.value = '';
        h.value = '';
    }

    handleChangeZoom = (e, factor) => {
        let newTransform = this.state.transform * factor;
        this.setState({transform: newTransform})
    }

    selectComponent = (e, element) => {
        e.stopPropagation();
        // const element = document.getElementById("wireframe-control-"+ this.props.id);
        this.setState({selected: element})
        console.log('selected')
    }

    deSelectComponent = () => {
        this.setState({selected: null})
    }
    

    render() { 
        const auth = this.props.auth;
        if (!auth.uid) {
            return <Redirect to="/" />;
        }
        const diagram = this.props.diagram;
        if(!diagram)
             return <React.Fragment />
        return (
            <div className="content-area" >
                <div className="row">
                    <div className=" left-slide-anim toolbar-card">
                            <div className=" btn toolbar-btn toolbar-btn-color horizontal-spacer waves-effect waves-light" onClick={(e) => this.handleChangeZoom(e, 2)} >
                                <i className="material-icons small toolbar-text valign-wrapper grey-text text-darken-3">zoom_in</i>
                            </div> 
                            <div className=" btn toolbar-btn toolbar-btn-color horizontal-spacer waves-effect waves-light" onClick={(e) => this.handleChangeZoom(e, 0.5)} >
                                <i className="material-icons small toolbar-text valign-wrapper grey-text text-darken-3">zoom_out</i>
                            </div>
                            <div className=" btn toolbar-btn toolbar-btn-color horizontal-spacer waves-effect waves-light">
                                <i className="material-icons small toolbar-text valign-wrapper grey-text text-darken-3">save</i>
                            </div>
                            <div className=" btn toolbar-btn toolbar-btn-color horizontal-spacer waves-effect waves-light" onClick={this.goHome} >
                                <i className="material-icons small toolbar-text valign-wrapper grey-text text-darken-3">close</i>
                            </div>
                            <div className= {"right btn toolbar-btn  waves-effect waves-light " + this.state.editDim} onClick={this.handleChangeDimension}>
                                <i className="material-icons small toolbar-text valign-wrapper grey-text text-darken-3">update</i>
                            </div>
                            <input id="height_field" className="wireframe-option right " type="text"  name="height" onChange={this.handleEditDim} placeholder = {"Current height: " + this.state.height}  />
                            <input id="width_field" className="wireframe-option right " type="text" name="width" onChange={this.handleEditDim}  placeholder = {"Current width: " + this.state.width}  />
                            <input id="name_field" className="wireframe-option right " type="text" name="width" onChange={this.handleEditName}  value = {this.state.name}  />
                            
                    </div>
                </div>
                
                <div className=" ">
                    <div className = "side-bar left brown lighten-4 left-slide-anim col s1 z-depth-2">
                        <div className="left-side-bar waves-effect waves-light center" onClick={(e) => this.handleNewComponent(e, 'container')}>
                            Container
                            <div className="mock-container grey lighten-3 z-depth-1"> &nbsp; </div>
                        </div>
                        <div className="left-side-bar waves-effect waves-light center" onClick={(e) => this.handleNewComponent(e, 'label')}>
                            Label
                            <div className="left-side-bar mock-label z-depth-1">Prompt for Input: </div>
                        </div>
                        <div className="left-side-bar waves-effect waves-light center" onClick={(e) => this.handleNewComponent(e, 'button')}>
                            Button
                            <br/>
                            <div className="btn toolbar-btn-color mock-button ">Submit</div>
                        </div>
                        <div className="left-side-bar waves-effect waves-light center" onClick={(e) => this.handleNewComponent(e, 'textfield')}>
                            Textfield
                            <div className = "mock-input z-depth-1">
                                <input type="text" placeholder="Input" className = "mock-input"></input>
                            </div>
                            
                        </div>
                        <br/>
                    </div>
                      
                    <div className = "side-bar-right right right-slide-anim col s1 z-depth-2 brown lighten-4">
                        <h5 className="">Properties</h5>
                        <div className="right-side-bar">Font Size:
                            <input type="text" className="right-side-text-input right"/>
                        </div>
                        {/* now I can do if selected, load this thing w/ properties */}
                        {/* <div className="right-side-wrapper">
                            <div className="properties-labels right-side-bar center">
                                <div className="right-side-bar">Font Size:</div>                
                                <div className="right-side-bar">Background:</div>                  
                                <div className="right-side-bar">Border Color:</div>                  
                                <div className="right-side-bar">Border Thickness:</div>                  
                                <div className="right-side-bar">Border Radius:</div>                  
                            </div>
                            <div className="properties-controls right-side-bar ">
                                <div className="right-side-bar right">
                                    <input type="text" className=" right-side-text-input"/>
                                </div>
                                <div className=" color-wrapper z-depth-1">
                                    <input type="color" className=" "/>
                                </div>     
                                <div className=" color-wrapper z-depth-1">
                                    <input type="color" className=" "/>
                                </div>     
                                <div className=" color-wrapper z-depth-1">
                                    <input type="color" className=" "/>
                                </div> 
                                <div className="right-side-bar ">
                                    <input type="text" className=" right-side-text-input"/>
                                </div>
                                <div className="right-side-bar ">
                                    <input type="text" className=" right-side-text-input"/>
                                </div>    
                            </div>
                        </div> */}
                        {/* placeholder should be the current font size */}
                        {/* <div className="right-side-bar">Font Size:
                            <input type="text" className="right-side-text-input"/>
                            
                        </div>
                        <div className="right-side-bar">Text Color:
                            <span className="color-wrapper z-depth-1 ">
                                <input type="color" className=""/>
                            </span>
                            
                        </div>
                        <div className="right-side-bar">Background:
                            <span className="color-wrapper z-depth-1 ">
                                <input type="color" className=""/>
                            </span>
                        </div>
                        <div className="right-side-bar">Border Color:
                            <span className="color-wrapper z-depth-1 ">
                                <input type="color" className=""/>
                            </span>
                        </div>
                        <div className="right-side-bar">Border Thickness:
                            <input type="text" className="right-side-text-input"/>
                        </div>
                        <div className="right-side-bar">Border Radius:
                            <input type="text" className="right-side-text-input"/>
                        </div> */}
                    </div>
                    <Wireframe components={this.state.components} diagram = {this.props.diagram}
                     width = {this.state.width} height = {this.state.height} transform = {this.state.transform}
                     selected = {this.state.selected} select = {this.selectComponent} deselect = {this.deSelectComponent} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const { username } = ownProps.match.params;
  const { diagrams } = state.firestore.data;
  const diagram = diagrams ? diagrams[id] : null;

  return {
    diagram,
    id,
    auth: state.firebase.auth,
  };
};

const mapDispatchToProps = dispatch => ({
    updateEditTime: (id) => dispatch(updateEditTime(id)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'diagrams' },
  ]),
)(EditScreen);