import { combineReducers } from "redux";
import authReducer from "./userReducer";

const rootReducer = combineReducers({
    auth: authReducer
});

export default rootReducer;