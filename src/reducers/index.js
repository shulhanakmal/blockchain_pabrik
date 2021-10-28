import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import auth from "./auth";
import message from "./message";


export default combineReducers({
  form: formReducer,
  auth,
  message,
});
