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
        console.log('wireframe mounted')
    }

    render() {
        return (
            <div id="scrollable" className="scrollable bottom-slide-anim">
                <div id="wireframe" className = "layout-area brown lighten-4 z-depth-2 " onClick = {this.props.deselect}>
                    <WireframeComponents key = {this.props.components} components = {this.props.components} selected={this.props.selected} updateDetails = {this.props.updateDetails}
                    select = {this.props.select} deselect = {this.props.deselect} />
                </div>
            </div>
            
        );
    }
}
export default Wireframe;