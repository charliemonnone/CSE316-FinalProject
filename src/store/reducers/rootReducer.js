import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore'; // syncing firestore
import { firebaseReducer } from 'react-redux-firebase';
import authReducer from './authReducer';
import controlFlowReducer from './controlFlowReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer,
  controlFlow: controlFlowReducer,
});

export default rootReducer;