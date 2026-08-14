const loginForm = document.querySelector("form[action='/login']");
const loginLink = document.querySelector("[data-auth-login]");
const registerLink = document.querySelector("[data-auth-register]");
const profileLink = document.querySelector("[data-auth-profile]");
const logoutForm = document.querySelector("[data-auth-logout]");

if (loginForm instanceof HTMLFormElement) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const response = await fetch("/login", {
      method: "POST",
      body: new URLSearchParams(new FormData(loginForm)),
    });

    if (!response.ok) {
      document.open();
      document.write(await response.text());
      document.close();
      return;
    }

    const { token } = await response.json();

    sessionStorage.setItem("authToken", token);
    setAuthNavigation(true);
    window.location.assign("/my-profile");
  });
}

const setAuthNavigation = (isAuthenticated) => {
  loginLink?.toggleAttribute("hidden", isAuthenticated);
  registerLink?.toggleAttribute("hidden", isAuthenticated);
  profileLink?.toggleAttribute("hidden", !isAuthenticated);
  logoutForm?.toggleAttribute("hidden", !isAuthenticated);
};

setAuthNavigation(Boolean(sessionStorage.getItem("authToken")));
if (logoutForm instanceof HTMLFormElement) {
  logoutForm.addEventListener("submit", () => {
    sessionStorage.removeItem("authToken");
    setAuthNavigation(false);
  });
}
