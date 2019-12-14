import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import Wireframe from './Wireframe.js';
import { updateEditTime, saveDiagramChanges } from '../../store/database/asynchHandler';
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
            save: 'disabled',
            transform: 0.9,
            components: diagram.components,
            selected: null,
        }
    }

    handleNewComponent = (e, type) => {
        let cmps = this.state.components;
        let newComponent = {
            key: Math.floor(Math.random() * 1000) + cmps.length + 1,
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
            if(this.state.selected !== null) {
                let cmps = this.state.components.map(a => ({...a}));
                let id = parseInt(this.state.selected);
                let comp;
                cmps.map((e) => {
                    if(e.key === id) comp = JSON.parse( JSON.stringify( e ) ) ;
                })
                
                comp.key = Math.floor(Math.random() * 1000) + cmps.length + 1;
                comp.x_position += 100;
                comp.y_position += 100;
                cmps.push(comp)
                console.log(comp)
                this.setState({components: cmps});
            }
        }
        if (e.keyCode === 46) {
            
            if(this.state.selected !== null) {
                
                let cmps = this.state.components.map(a => ({...a}));
                let id = parseInt(this.state.selected);
                let newArr = cmps.filter((e) => e.key !== id)
                this.setState({components: newArr}, () => {
                    this.setState({selected: null})
                });
                
            }
        }
    }

    goHome = () => {
        this.props.history.push('/ ');
    }

    handleSaveDiagram = () => {
        let oldDiagram = this.props.diagram;
        let id = this.props.id;
        let diagram = {
            owner_name: oldDiagram.owner_name,
            user_id: "",
            diagram_name: this.state.name,
            wireframe: {width: this.state.width, height: this.state.height,},
            components: this.state.components,
        }
        console.log(diagram)
        this.props.saveDiagramChanges(id, diagram)
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
        this.setState({selected: parseInt(element)})
        
    }

    deSelectComponent = () => {
        this.setState({selected: null})
    }

    handleEditDetails = (data) => {
        let cmps = this.state.components;
        cmps.map((e) => {if(e.key === this.state.selected) {
            e.x_position = data.x === undefined ? e.x_position : parseInt(data.x);
            e.y_position = data.y === undefined ? e.y_position : parseInt(data.y);
            e.width = data.width;
            e.height = data.height;
            console.log(e)
            }
        })
        this.setState({components: cmps}, console.log(this.state.components))
    }

    handleEditProperty = (event) => {
        const element = document.getElementById(event.target.id);
        const selectedProperty = event.target.id;
        console.log(element.value)
        let cmps = this.state.components;
        cmps.map((e) => {if(e.key === this.state.selected) {
                if(selectedProperty === 'value') e[selectedProperty] = element.value;
                else e.properties[selectedProperty] = element.value;
            } 
        })
        this.setState({components: cmps})

    }
    handleEditBackgroundColor = (color, event) => {
        let cmps = this.state.components.map(a => ({...a}));
        cmps.map((e) => {if(e.key === this.state.selected) {
                e.properties.background_color = color.hex;
            } 
        })
        this.setState({components: cmps})
    }
    handleEditBorderColor = (color, event) => {
        let cmps = this.state.components;
        cmps.map((e) => {if(e.key === this.state.selected) {
                e.properties.border_color = color.hex;
            } 
        })
        this.setState({components: cmps})
    }

    componentDidMount() {
        document.addEventListener('keydown',this.handleKeyDown)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown)
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
        }
        
        console.log('selected: ' + this.state.selected);
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
                            <div className=" btn toolbar-btn toolbar-btn-color horizontal-spacer waves-effect waves-light " onClick={this.handleSaveDiagram} >
                                <i className="material-icons small toolbar-text valign-wrapper grey-text text-darken-3">save</i>
                            </div>
                            <div className=" btn toolbar-btn toolbar-btn-color horizontal-spacer waves-effect waves-light" onClick={this.goHome} >
                                <i className="material-icons small toolbar-text valign-wrapper grey-text text-darken-3">close</i>
                            </div>
                            <div className= {"right btn toolbar-btn  waves-effect waves-light " + this.state.editDim} onClick={this.handleChangeDimension}>
                                <i className="material-icons small toolbar-text valign-wrapper grey-text text-darken-3">update</i>
                            </div>
                            <input id="height_field" className="wireframe-option right " type="number"  name="height" onChange={this.handleEditDim} placeholder = {"Current height: " + this.state.height}  />
                            <input id="width_field" className="wireframe-option right " type="number" name="width" onChange={this.handleEditDim}  placeholder = {"Current width: " + this.state.width}  />
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
                        <div className="right-side-bar">Text:
                            <input id="value" type="text" className="right-side-text-input right"
                             value = {loadProperties.value} onChange={this.handleEditProperty} />
                        </div>
                        <div className="right-side-bar">Font Size:
                            <input id="font_size" type="number" className="right-side-text-input right"
                             value = {loadProperties.font_size} onChange={this.handleEditProperty} />
                        </div>
                        <div className="right-side-bar"> Background Color:
                            <CompactPicker id="background_color" color = {loadProperties.background_color} onChange={this.handleEditBackgroundColor} />
                        </div>
                        <div className="right-side-bar"> Border Color:
                            <CompactPicker id="border_color" color = {loadProperties.border_color} onChange={this.handleEditBorderColor} />
                        </div>
                        <div className="right-side-bar">Border Thickness:
                            <input id="border_thickness" type="number" className="right-side-text-input right" 
                            value = {loadProperties.border_thickness} onChange={this.handleEditProperty} />
                        </div>
                        <div className="right-side-bar">Border Radius:
                            <input id="border_radius" type="number" className="right-side-text-input right"
                            value = {loadProperties.border_radius} onChange={this.handleEditProperty} />
                        </div>
                    </div>
                    <Wireframe components={this.state.components} diagram = {this.props.diagram} updateDetails = {this.handleEditDetails}
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
    saveDiagramChanges: (id, diagram) => dispatch(saveDiagramChanges(id, diagram))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'diagrams' },
  ]),
)(EditScreen);