import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import { createDiagram } from '../../store/database/asynchHandler';
import { deleteDiagram } from '../../store/database/asynchHandler';
import DiagramLinks from './DiagramLinks';
import DeleteModal from './DeleteModal';

class HomeScreen extends Component {

    state = {
        newList: false,
        modal: false,
        selectedDiagram : '',
    }

    handleNewDiagram = (e) => {
        e.preventDefault();
        const user = this.props.profile;
        const username = user.firstName + "-" + user.lastName;
        const newDiagram =  {
            diagram_name: 'Unknown',
            wireframe: {width: 500, height: 500},
            owner_name: username,
            components: [],
            lastEdit: new Date(),
            sortBy: '',
        }
        this.props.createDiagram(newDiagram);
        this.setState({newList : true});
    }

    handleDelete = (e, choice) => {
        e.preventDefault();
        if(choice) this.props.deleteDiagram(this.state.selectedDiagram);
        this.toggleModal();
    }

    toggleModal = (id) => {
        this.setState({modal: !this.state.modal});
        this.setState({selectedDiagram: id})

    }

    render() {
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }
        if (this.state.newList) {
            const id = this.props.state.controlFlow.last_added_id;
            const diagramToLoad = this.props.state.controlFlow.last_added_object;
            console.log(id);
            if(id) {

                const user = this.props.profile;
                const username = user.firstName + "-" + user.lastName;
                const newRoute = {
                    pathname: '/' + username + "/edit/" + id,
                    state:{
                        diagram: diagramToLoad
                    }
                }
                return <Redirect to = {newRoute} />
            } 
        }

        return (
            <div className="dashboard container">
                <DeleteModal visible={this.state.modal} handleDelete={this.handleDelete} />
                <div className="row">
                    {/* <div className="col s6 offset-s3">
                        <div className="card grey darken-3 card-anim">
                        <h4 className="center-align white-text">Recent Work</h4>
                        </div>
                        
                    </div> */}
                    <div className="left-slide-anim divider col s6 offset-s3 spacer grey darken-1"></div>
                    <div className="col s4 offset-s4 diagram-list scrollbar" id="style-1"> <DiagramLinks toggleModal={this.toggleModal} /> </div>
                    <div className="right-slide-anim divider col s6 offset-s3 spacer grey darken-1"></div>
                    <div className="bottom-slide-anim col s4 offset-s4 waves-effect waves-light btn new-btn hoverable general-btn-color"
                        onClick={this.handleNewDiagram}>
                        Create a New Diagram
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        state: state,
        profile: state.firebase.profile,
    };
};

const mapDispatchToProps = dispatch => ({
    createDiagram: (newDiagram) => dispatch(createDiagram(newDiagram)),
    deleteDiagram: (id) => dispatch(deleteDiagram(id)),
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
      { collection: 'diagrams', orderBy: ['lastEdit', 'desc'] },
    ]),
)(HomeScreen);