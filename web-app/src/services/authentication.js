const GOOGLE_CLIENT_ID = "388702499328-ld8l7lj9kggb3nfs53aoq7k651udla6u.apps.googleusercontent.com";

function login(googleAuthorizationCode) {
  return fetch("/login/google", {
    method: "POST",
    body: googleAuthorizationCode
  })
    .then(r => r.ok ? r.text() : Promise.reject("Fail !"))
    .then(token => {
      localStorage.setItem("token", token);
      return token;
    });
}

function logout() {
  localStorage.setItem("token", null);
  return Promise.resolve();
}

function getToken() {
  return localStorage.getItem("token");
}

function isAuthenticated() {
  return !!getToken();
}

export default {
  GOOGLE_CLIENT_ID,
  login,
  logout,
  isAuthenticated,
  getToken
};
