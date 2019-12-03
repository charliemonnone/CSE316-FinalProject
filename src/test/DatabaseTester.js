import React from 'react'
import { connect } from 'react-redux';
import diagramJson from './DiagramData.json'
import { getFirestore } from 'redux-firestore';

class DatabaseTester extends React.Component {
    handleClear = () => {
        const fireStore = getFirestore();
        console.log(diagramJson)
        fireStore.collection('diagrams').get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                console.log("deleting " + doc.id);
                fireStore.collection('diagrams').doc(doc.id).delete();
            })
        });
    }

    handleReset = () => {
        const fireStore = getFirestore();
        console.log(diagramJson)
        diagramJson.diagrams.forEach(diagramJson => {
            fireStore.collection('diagrams').add({
                    owner_name: diagramJson.owner_name,
                    diagram_name: diagramJson.diagram_name,
                    // key: diagramJson.key,
                    wireframe: diagramJson.wireframe,
                    components: diagramJson.components,
                    lastEdit: new Date(),
                    sortBy: '',
                }).then((docRef) => {
                    console.log(docRef)
                    console.log("DATABASE RESET");
                }).catch((err) => {
                    console.log(err);
                });
        });
    }

    render() {
        console.log("in tester")
        console.log(this.props.firebase);
        return (
            <div>
                <button onClick={this.handleClear}>Clear Database</button>
                <button onClick={this.handleReset}>Reset Database</button>
            </div>)
    }
}

const mapStateToProps = function (state) {
    return {
        auth: state.firebase.auth,
        firebase: state.firebase
    };
}

export default connect(mapStateToProps)(DatabaseTester);