document
  .getElementById("signup-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    try {
      const response = await axios.post(
        "http://localhost:8080/movie-ai/backend/apis/signup.php",
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
        window.location.href = "signin.html";
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("An error occurred during sign up. Please try again.");
    }
  });

document.getElementById("take-me").addEventListener("click", function () {
  window.location.href = "signin.html";
});
