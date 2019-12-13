import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

class DiagramCard extends React.Component {

    toggleModal = (e, id) => {
        e.preventDefault();
        this.props.toggleModal(id);
    }

    render() {
        const { diagram } = this.props;
        return (
            <div className="card fade-in-anim diagram-card grey darken-3 z-depth-1 hoverable ">
                <div className="card-content ">
                    <div className="card-title white-text center-align">
                        {diagram.diagram_name}
                        <div className="delete-btn btn right general-btn-color waves-effect waves-light" onClick={(e) => this.toggleModal(e, diagram.id)}>
                            <i className="material-icons small grey-text text-darken-3">close</i>
                        </div>
                    </div>
                    
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
      auth: state.firebase.auth,
    };
};

const mapDispatchToProps = dispatch => ({
    // updateEditTime: (id) => dispatch(updateEditTime(id)),
    
});

export default compose(
    connect(mapStateToProps,mapDispatchToProps)
)(DiagramCard);