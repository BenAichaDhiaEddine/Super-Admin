import axios from "axios";
var qs = require("querystring");

export const baseURL = "http://localhost:3009/v1";

const Client = axios.create({
  baseURL,
  timeout: 5000,
});
const config = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};


// Gets the logged in user data from local session
const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

//is user is logged in
const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

// Register Method
const postRegister = (url, data) => {
  return axios
    .post(url, data)
    .then((response) => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })
    .catch((err) => {
      var message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Login Method
const postLogin = (url, data) => {
  const user = {
    email: data.username,
    password: data.password,
  };
  return Client.post(url, qs.stringify(user), config)
    .then((response) => {
      if (
        response.status === 401 ||
        response.status === 400 ||
        response.status === 500
      )
        throw response.data;
      return response.data;
    })
    .catch((err) => {
      throw err.response.data.message;
      // throw err[1];
    });
};

// postForgetPwd
const postForgetPwd = (url, data) => {
  return axios
    .post(url, data)
    .then((response) => {
      if (response.status === 400 || response.status === 500)
        throw response.data;
      return response.data;
    })
    .catch((err) => {
      throw err[1];
    });
};

export {
  getLoggedInUser,
  isUserAuthenticated,
  postRegister,
  postLogin,
  postForgetPwd,
};
