document.addEventListener("DOMContentLoaded", () => {
  let movies;
  let activities;
  let recommended;
  let userId = Number(localStorage.getItem("userid"));
  const messages = [
    {
      role: "system",
      content: `recommemd to the user based on his activity a list of new movies that he doesnt know yet that you select from the movies list i provide. return a list of recommended movies in form of array`,
    },
  ];

  function displayRandomMovie() {
    const randomMovie = movies[Math.floor(Math.random() * movies.length)];
    const header_movie = document.getElementById("header-movie");
    header_movie.style.background = `linear-gradient(rgba(1, 1, 1, 0.01) 30%, rgba(1, 1, 1, 1)), url(${randomMovie.poster})`;
    header_movie.style.backgroundPosition = "top";
    document.getElementById("movie-title").textContent = randomMovie.title;
    document.getElementById("movie-description").textContent =
      randomMovie.description;
  }

  function displayRandomRecommendedMovie(recommended) {
    const randomMovie =
      recommended[Math.floor(Math.random() * recommended.length)];
    const movie_section = document.getElementById("movie-section");
    movie_section.style.background = `linear-gradient(rgba(1, 1, 1, 0.01) 30%, rgba(1, 1, 1, 1)), url(${randomMovie.poster})`;
    movie_section.style.backgroundPosition = "top";
    document.getElementById("movie-title-reco").textContent = randomMovie.title;
    document.getElementById("movie-description-reco").textContent =
      randomMovie.description;
    document.getElementById("movie-genre").querySelector(".light").textContent =
      randomMovie.genre;
  }

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
            Authorization: `Bearer ${config.API_KEY}`,
          },
        }
      );
      console.log(response.data.choices[0].message.content);
      recommended = eval(
        response.data.choices[0].message.content.match(/\[.*\]/s)[0]
      );
      console.log(recommended);

      if (recommended.length != movies.length) {
        const moviesRecommended = movies.filter((movie) =>
          recommended.includes(movie.title)
        );

        updatePage(moviesRecommended, "recommendations");
        displayRandomRecommendedMovie(moviesRecommended);
      }
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
        messages.push({
          role: "system",
          content: `Movies: ${JSON.stringify(
            movies.map((movie) => movie.title)
          )}`,
        });
        updatePage(movies, "all-movies-content");
        displayRandomMovie();
        callAssistant();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function updatePage(movies, section) {
    const all_movies = document.getElementById(section);
    movies.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.className = "movie-card flex column end";
      movieCard.id = movie.title;
      movieCard.style.background = `linear-gradient(rgba(1, 1, 1, 0.01) 30%, rgba(1, 1, 1, 1)), url(${movie.poster})`;
      movieCard.setAttribute("movie-id", movie.id);
      movieCard.innerHTML = `
        <div class="movie-info">
          <h3 class="regular text-white">${movie.title}</h3>
          <p class="extralight text-white">${movie.genre}</p>
        </div>`;
      movieCard.addEventListener("click", () => {
        localStorage.setItem("movie-id", movie.movie_id);
        window.location.href = "movie.html";
      });
      all_movies.appendChild(movieCard);
    });
  }
});
