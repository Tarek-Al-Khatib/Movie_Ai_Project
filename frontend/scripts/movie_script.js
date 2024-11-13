let movies;
axios
  .get("http://localhost:8080/movie-ai/backend/apis/get_all_movies.php")
  .then((response) => {
    movies = response.data;
    console.log(movies);
    const all_movies = document.getElementById("all-movies-content");
    movies.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.className = "movie-card flex column end";
      movieCard.id = movie.title;
      movieCard.style.background = `linear-gradient(rgba(1, 1, 1, 0.01) 30%, rgba(1, 1, 1, 1)), url(${movie.poster})`;
      movieCard.innerHTML = `
        <div class="movie-info">
          <h3 class="regular text-white">${movie.title}</h3>
          <p class="regular text-white">${movie.genre}</p>
        </div>`;

      all_movies.appendChild(movieCard);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });
