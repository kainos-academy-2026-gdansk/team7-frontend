const loginForm = document.querySelector("form[action='/login']");

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
    window.location.assign("/");
  });
}
const logoutForm = document.querySelector("form[action='/logout']");

if (logoutForm instanceof HTMLFormElement) {
  logoutForm.addEventListener("submit", () => {
    sessionStorage.removeItem("authToken");
  });
}
