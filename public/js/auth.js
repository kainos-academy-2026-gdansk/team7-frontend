const loginForm = document.querySelector("form[action='/login']");
const loginLink = document.querySelector("[data-auth-login]");
const profileLink = document.querySelector("[data-auth-profile]");
const logoutForm = document.querySelector("[data-auth-logout]");
const greeting = document.querySelector("[data-auth-greeting]");
const storedDisplayName = sessionStorage.getItem("authDisplayName");

if (greeting && storedDisplayName) {
  greeting.textContent = `Hello ${storedDisplayName}`;
}

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

    const { token, user } = await response.json();
    const emailName = user.email.split("@")[0].split(".")[0];
    const displayName = `${emailName.charAt(0).toUpperCase()}${emailName.slice(1)}`;

    sessionStorage.setItem("authToken", token);
    sessionStorage.setItem("authDisplayName", displayName);
    setAuthNavigation(true);
    window.location.assign("/my-profile");
  });
}

const setAuthNavigation = (isAuthenticated) => {
  loginLink?.toggleAttribute("hidden", isAuthenticated);
  profileLink?.toggleAttribute("hidden", !isAuthenticated);
  logoutForm?.toggleAttribute("hidden", !isAuthenticated);
};

setAuthNavigation(Boolean(sessionStorage.getItem("authToken")));
if (logoutForm instanceof HTMLFormElement) {
  logoutForm.addEventListener("submit", () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("authDisplayName");
    setAuthNavigation(false);
  });
}
