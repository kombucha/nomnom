const GOOGLE_CLIENT_ID = "388702499328-ld8l7lj9kggb3nfs53aoq7k651udla6u.apps.googleusercontent.com";
const TOKEN_STORAGE_KEY = "token";

function login(googleAuthorizationCode) {
  return fetch("/login/google", {
    method: "POST",
    body: googleAuthorizationCode
  })
    .then(r => r.ok ? r.text() : Promise.reject("Fail !"))
    .then(token => {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      notifyListeners(true);
      return token;
    });
}

function logout() {
  const hasChanged = isAuthenticated();
  localStorage.setItem(TOKEN_STORAGE_KEY, null);

  if (hasChanged) {
    notifyListeners(false);
  }

  return Promise.resolve();
}

function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

function isAuthenticated() {
  return !!getToken();
}

// Listen to storage events
// Listeners won't be notified twice because storage event aren't trigger on the window from which the changes came from
window.addEventListener("storage", ({ key, newValue }) => {
  if (key === TOKEN_STORAGE_KEY) {
    notifyListeners(!!newValue);
  }
});

const listeners = new Set();
function notifyListeners(isAuthenticated) {
  listeners.forEach(fn => fn(isAuthenticated));
}

function addChangeListener(fn) {
  listeners.add(fn);
}

function removeChangeListener(fn) {
  listeners.delete(fn);
}

export default {
  GOOGLE_CLIENT_ID,
  login,
  logout,
  isAuthenticated,
  getToken,

  addChangeListener,
  removeChangeListener
};
