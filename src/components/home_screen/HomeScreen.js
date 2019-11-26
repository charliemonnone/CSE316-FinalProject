import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import DiagramLinks from './DiagramLinks'

class HomeScreen extends Component {

    render() {
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s6 offset-s3">
                        <div className="card grey darken-3 card-anim">
                        <h4 className="center-align white-text">Recent Work</h4>
                        </div>
                        
                    </div>
                    <div className="col s4 offset-s4 diagram-list scrollbar" id="style-1"> <DiagramLinks /> </div>
                    <div className="card-anim divider col s6 offset-s3 spacer"></div>
                    <div className="card-anim col s4 offset-s4 waves-effect waves-light btn new-btn hoverable blue accent-3">
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
        state: state
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
      { collection: 'diagrams' },
    ]),
)(HomeScreen);