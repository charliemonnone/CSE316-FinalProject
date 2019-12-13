import * as actionCreators from '../actions/actionCreators'
const initState = {
};

const controlFlowReducer = (state = initState, action) => {
    switch(action.type) {
        case actionCreators.UPDATE_LAST_ADDED:
            console.log(action);
            return Object.assign({}, state, {
                last_added_id: action.id,
                last_added_object: action.diagram,
            })
        default:
            return state;
    }
};
export default controlFlowReducer;