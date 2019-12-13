import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import Wireframe from './Wireframe.js';
import { updateEditTime } from '../../store/database/asynchHandler';
import { firestoreConnect } from 'react-redux-firebase';
import { CompactPicker } from 'react-color';

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
            key: this.state.components.length + 1,
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
        if (e.keyCode === 68 && e.ctrlKey) {
            if(this.state.selected != undefined) {
                let duplicate = document.getElementById(this.state.selected);
                let cmps = this.state.components;
                let comp ;
                cmps.map((e) => {if(e.key === parseInt(duplicate.id)) comp = Object.assign({}, e)})
                comp.key = Math.floor(Math.random() * 1000) + cmps.length + 1;
                // comp.key = cmps.length
                cmps.push(comp)
                this.setState({components: cmps});
            }
        }
        if (e.keyCode === 46) {
            if(this.state.selected != undefined) {
                let element = document.getElementById(this.state.selected);
                let cmps = this.state.components;
                let id = parseInt(element.id);
                let newArr = cmps.filter((e) => e.key !== id)
                console.log(newArr)
                this.setState({components: newArr});
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
            width: Math.min(Math.max(w.value, 10), 1150),
            height: Math.min(Math.max(h.value, 10), 590),
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
        this.setState({selected: element})
        
    }

    deSelectComponent = () => {
        this.setState({selected: null})
    }

    handleEditProperties = () => {

    }
    

    render() { 
        const auth = this.props.auth;
        if (!auth.uid) {
            return <Redirect to="/" />;
        }
        const diagram = this.props.diagram;
        if(!diagram)
             return <React.Fragment />
        let loadProperties = {
            font_size: '',
            background_color: '',
            border_color: '',
            border_thickness: '',
            border_radius: '',
            value: ''
        } 
        
        if(this.state.selected !== null) {
            this.state.components.map((e) => {if(e.key === parseInt(this.state.selected)) {
                loadProperties = e.properties
                loadProperties.value = e.value
                }
            } )
            
            // loadProperties = this.state.components[this.state.selected].properties;
        }
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
                        <div className="right-side-bar">Value:
                            <input type="text" className="right-side-text-input right"
                             value = {loadProperties.value} onChange={this.handleEditProperties} />
                        </div>
                        <div className="right-side-bar">Font Size:
                            <input type="text" className="right-side-text-input right"
                             value = {loadProperties.font_size} onChange={this.handleEditProperties} />
                        </div>
                        <div className="right-side-bar"> Background Color:
                            <CompactPicker  />
                        </div>
                        <div className="right-side-bar"> Border Color:
                            <CompactPicker />
                        </div>
                        <div className="right-side-bar">Border Thickness:
                            <input type="text" className="right-side-text-input right" 
                            value = {loadProperties.border_thickness} onChange={this.handleEditProperties} />
                        </div>
                        <div className="right-side-bar">Border Radius:
                            <input type="text" className="right-side-text-input right"
                            value = {loadProperties.border_radius} onChange={this.handleEditProperties} />
                        </div>
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