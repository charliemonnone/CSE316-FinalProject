import * as actionCreators from '../actions/actionCreators.js'

export const loginHandler = ({ credentials, firebase }) => (dispatch, getState) => {
    firebase.auth().signInWithEmailAndPassword(
      credentials.email,
      credentials.password,
    ).then(() => {
      console.log("LOGIN_SUCCESS");
      dispatch({ type: 'LOGIN_SUCCESS' });
    }).catch((err) => {
      dispatch({ type: 'LOGIN_ERROR', err });
    });
  };

export const logoutHandler = (firebase) => (dispatch, getState) => {
    firebase.auth().signOut().then(() => {
        dispatch(actionCreators.logoutSuccess);
    });
};

export const registerHandler = (newUser, firebase) => (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firebase.auth().createUserWithEmailAndPassword(
        newUser.email,
        newUser.password,
    ).then(resp => firestore.collection('users').doc(resp.user.uid).set({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        initials: `${newUser.firstName[0]}${newUser.lastName[0]}`,
        user_level: 'ui_designer',
    })).then(() => {
        dispatch(actionCreators.registerSuccess);
    }).catch((err) => {
        dispatch(actionCreators.registerError);
    });
};

export const deleteDiagram = (id) => (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  let docRef  = firestore.collection('diagrams').doc(id);
  docRef.delete();
};

export const createDiagram = (diagram) => (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  firestore.collection('diagrams').add({
    ...diagram,
  }).then(docRef => {
    dispatch(actionCreators.updateLastAdded(docRef.id));
    
  });
}

export const updateEditTime = (id) => (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  const docRef = firestore.collection('diagrams').doc(id);
  docRef.update({
    lastEdit: new Date(),
  });
}