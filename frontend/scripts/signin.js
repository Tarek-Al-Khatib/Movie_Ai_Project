document
  .getElementById("signin-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("signin-username").value;
    const password = document.getElementById("signin-password").value;

    try {
      const response = await axios.post(
        "http://localhost:8080/movie-ai/backend/apis/signin.php",
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        localStorage.setItem("userid", response.data.user_id);
        window.location.href = "home.html";
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error signing in:", error);
      alert("An error occurred while trying to sign in.");
    }
  });

document.getElementById("take-me").addEventListener("click", function () {
  window.location.href = "signup.html";
});
