import React from 'react';
import WireframeComponents from './WireframeComponents';


class Wireframe extends React.Component {

    state = {
        width: this.props.width,
        height: this.props.height,
        transform: this.props.transform,
        selected: null
    }

    setDimensions = () => {
        let wf = document.getElementById('wireframe');
        let sc = document.getElementById('scrollable');
        wf.style.width = this.state.width + 'px';
        wf.style.height = this.state.height + 'px';
        sc.style.width = this.state.width + 'px';
        sc.style.height = this.state.height + 'px';
    }

    setZoom = () => {
        let wf = document.getElementById('wireframe');
        wf.style.transform = 'scale('+ this.state.transform + ')';
    }

    // selectComponent = (e, element) => {
    //     e.stopPropagation();
    //     // const element = document.getElementById("wireframe-control-"+ this.props.id);
    //     this.setState({selected: element})
    //     console.log('selected')
    // }

    // deSelectComponent = () => {
    //     this.setState({selected: null})
    // }

    static getDerivedStateFromProps(nextProps, prevState){

        if(nextProps !== prevState) {
            return {width: nextProps.width, height: nextProps.height, transform: nextProps.transform}
        }
        else return null;
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
            this.setDimensions()
        }

        if(this.props.transform !== prevProps.transform) this.setZoom();
    }

    componentDidMount() {
        this.setDimensions();
        this.setZoom();
    }

    render() {
        return (
            <div id="scrollable" className="scrollable bottom-slide-anim">
                <div id="wireframe" className = "layout-area brown lighten-4 z-depth-2 " onClick = {this.props.deselect}>
                    <WireframeComponents components = {this.props.components} selected={this.props.selected} 
                    select = {this.props.select} deselect = {this.props.deselect} />
                    {/* react component holding controls is passed the components pulled from loaded diagram, add controls added 
                    to this local array, when saved applied to firebase */}
                    
                </div>
            </div>
            
        );
    }
}
export default Wireframe;