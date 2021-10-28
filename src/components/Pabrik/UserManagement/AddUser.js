import { Fragment } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import AddUserForm from "./AddUserForm";
import UserService from "../../../services/user.service";
import showResults from "../../showResults/showResults";

const AddUser = () => {
  const handleSubmit = async (values) => {
    var raw = JSON.stringify(values);
    const formData = new FormData();
    formData.append('username',values.username);
    formData.append('email',values.email);
    formData.append('password',values.password);
    formData.append('role',values.role);
    formData.append('status', 1);
    console.log(values);

    UserService.addUser(formData).then(
      (response) => {
        console.log(response)
      },
      (error) => {
      }
    );
    showResults("Dimasukkan");
  };

  return (
    <Fragment>
        <AddUserForm onSubmit={handleSubmit} />
    </Fragment>
  );
};
export default AddUser;
