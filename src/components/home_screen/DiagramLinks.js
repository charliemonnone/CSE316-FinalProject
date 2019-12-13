import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';

import DiagramCard from './DiagramCard';

class DiagramLinks extends React.Component {

    render() {
        const diagrams = this.props.diagrams;
        const user = this.props.profile;
        const username = user.firstName + "-" + user.lastName;
        return (
            <div className=" section ">
                {diagrams && diagrams.map(diagram =>  {
                    if(diagram.owner_name === username) {
                        const newRoute = {
                            pathname: '/' + username + "/edit/" + diagram.id,
                            state:{
                                diagram: diagram
                            }
                        }
                        return  <Link to={newRoute} key={diagram.id} >
                                    <DiagramCard diagram={diagram} key={diagram.id} toggleModal={this.props.toggleModal} />
                                </Link>
                        
                    }                      
                }
                    
                )}
            </div>
        );
    }
}



const mapStateToProps = (state) => {
    return {
        diagrams: state.firestore.ordered.diagrams,
        profile: state.firebase.profile,
    };
};

export default compose(connect(mapStateToProps))(DiagramLinks);