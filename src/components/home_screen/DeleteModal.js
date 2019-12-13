import React from 'react';
class DeleteModal extends React.Component {
    render() {
        let modalStyle = " modal  ";
        if (this.props.visible) {
            modalStyle += " left-slide-anim is_visible";
        }
        return (
            <div className={modalStyle} >
                <div className="modal-content center-align grey darken-3">
                    <div className="row center-align">
                        <h3 className="white-text">Delete Diagram?</h3>
                    </div>
                    <br/>
                    <div className="row center-align">
                        <div className="col s1 offset-s5 horizontal-spacer btn toolbar-btn toolbar-btn-color  waves-effect waves-light" 
                            onClick = {(e) => this.props.handleDelete(e, true)}
                            >
                            Yes
                        </div>
                        <div className=" col s1  btn toolbar-btn toolbar-btn-color  waves-effect waves-light"
                            onClick = {(e) => this.props.handleDelete(e, false)}
                            >
                            No
                        </div>

                    </div>
                </div>
                
            </div>
        )
    }
}

export default DeleteModal