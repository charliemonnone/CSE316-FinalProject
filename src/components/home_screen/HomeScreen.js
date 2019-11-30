import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import { createDiagram } from '../../store/database/asynchHandler';
import DiagramLinks from './DiagramLinks'

class HomeScreen extends Component {

    state = {
        newList: false,
        lastAdded: this.props.state.firestore.ordered.last_added,
        userName: this.props.profile.firstName + "-" + this.props.profile.lastName,
    }

    handleNewDiagram = (e) => {
        e.preventDefault();
        const user = this.props.profile;
        const username = user.firstName + "-" + user.lastName;
        const newDiagram =  {
            diagram_name: 'Unknown',
            owner_name: username,
            components: [],
            lastEdit: new Date(),
            sortBy: '',
        }
        this.props.createDiagram(newDiagram);
        this.setState({newList : true});
    }

    render() {
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }
        // if (this.state.newList) {
        //     const id = this.props.state.firestore.ordered.last_added[0].last;
        //     return <Redirect to = {'/' + this.state.userName + "/edit/" + id} />
        // }

        return (
            <div className="dashboard container">
                <div className="row">
                    {/* <div className="col s6 offset-s3">
                        <div className="card grey darken-3 card-anim">
                        <h4 className="center-align white-text">Recent Work</h4>
                        </div>
                        
                    </div> */}
                    <div className="left-slide-anim divider col s6 offset-s3 spacer grey darken-1"></div>
                    <div className="col s4 offset-s4 diagram-list scrollbar" id="style-1"> <DiagramLinks /> </div>
                    <div className="right-slide-anim divider col s6 offset-s3 spacer grey darken-1"></div>
                    <div className="bottom-slide-anim col s4 offset-s4 waves-effect waves-light btn new-btn hoverable pink accent-3"
                        onClick={this.handleNewDiagram}>
                        Create a New Diagram
                    </div>
                    {/* <div className="col s8">
                    <div className="card z-depth-0.5 banner ">
                        <div className="card-content center-align white-text">
                            <div className="card-title"><h1>Wireframer</h1></div>
                        </div>
                    </div>

                        <div className="home_new_list_container">
                                <button className="home_new_list_button" onClick={this.handleNewList}>
                                    Create a New Diagram
                                </button>
                        </div>
                    </div> */}
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
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
      { collection: 'diagrams', orderBy: ['lastEdit', 'desc'] },
      { collection: 'last_added',}
    ]),
)(HomeScreen);