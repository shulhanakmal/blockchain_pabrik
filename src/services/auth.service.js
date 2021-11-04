import axios from "axios";

// const API_URL = "http://209.97.160.154:90/api/v1/";
// const API_URL = "http://127.0.0.1:8000/api/v2/";
const API_URL = "http://209.97.160.154:8002/api/v2/";

class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + "login", { email, password })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password) {
    return axios.post(API_URL + "register", {
      username,
      email,
      password,
    });
  }
}

export default new AuthService();
