document.addEventListener("DOMContentLoaded", () => {
  let movies;
  const messages = [
    {
      role: "system",
      content: `recommemd to the user based on his activity a list of new movies that he doesnt know yet that you select from the movies list i provide. return a list of movies written in javascript`,
    },
  ];

  let activities;

  let userId = 1;
  axios
    .get(
      `http://localhost:8080/movie-ai/backend/apis/get_activities_by_user.php`,
      {
        params: { user_id: userId },
      }
    )
    .then((response) => {
      activities = response.data;
      messages.push({
        role: "system",
        content: `Activities: ${JSON.stringify(activities)}`,
      });
      getMovies();
    })
    .catch((error) =>
      console.error("Error fetching activities by user ID:", error)
    );

  async function callAssistant() {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: messages,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`, // Replace with your actual API key
          },
        }
      );
      console.log(response.data.choices[0].message.content);
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Failed to call assistant:", error);
    }
  }
  async function getMovies() {
    axios
      .get("http://localhost:8080/movie-ai/backend/apis/get_all_movies.php")
      .then((response) => {
        movies = response.data;
        console.log(movies);
        console.log(movies["title"]);
        messages.push({
          role: "system",
          content: `Movies: ${JSON.stringify(
            movies.map((movie) => movie.title)
          )}`,
        });
        callAssistant();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function updatePage(movies) {
    const all_movies = document.getElementById("all-movies-content");
    movies.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.className = "movie-card flex column end";
      movieCard.id = movie.title;
      movieCard.style.background = `linear-gradient(rgba(1, 1, 1, 0.01) 30%, rgba(1, 1, 1, 1)), url(${movie.poster})`;
      movieCard.innerHTML = `
        <div class="movie-info">
          <h3 class="regular text-white">${movie.title}</h3>
          <p class="extralight text-white">${movie.genre}</p>
        </div>`;

      all_movies.appendChild(movieCard);
    });
  }
});
