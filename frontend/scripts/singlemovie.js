document.addEventListener("DOMContentLoaded", async () => {
  const movieId = localStorage.getItem("movie-id");
  const time = Date.now();
  let differenceTime;
  if (!movieId) {
    console.error("No movie ID found in localStorage");
    return;
  }

  try {
    const movieResponse = await axios.get(
      `http://localhost:8080/movie-ai/backend/apis/getMovie.php?movie_id=${movieId}`
    );
    const movieData = movieResponse.data;

    const ratingsResponse = await axios.get(
      `http://localhost:8080/movie-ai/backend/apis/getRatings.php?movie_id=${movieId}`
    );
    const ratingsData = ratingsResponse.data;

    document.querySelector(
      "h1"
    ).innerHTML = `${movieData.title} <span class="rating">${movieData.rating}<span class="star">★</span></span> <span class="bookmark">🔖</span>`;
    document.querySelector(".description").textContent = movieData.description;
    document.querySelector(
      ".movie-info .genres"
    ).innerHTML = `<span class="genre">${movieData.genre}</span>`;
    document
      .querySelector(".movie-info")
      .querySelector(
        "p:nth-of-type(2)"
      ).textContent = `Cast: ${movieData.cast}`;
    document
      .querySelector(".movie-info")
      .querySelector(
        "p:nth-of-type(3)"
      ).textContent = `Duration: ${movieData.duration}`;

    const lastRatingsContainer = document.querySelector(".last-rating");
    lastRatingsContainer.innerHTML = ratingsData
      .map(
        (rating) => `
          <p>
            ${rating.username} 
            <span class="user-rating">${rating.rating}<span class="star">★</span></span>
          </p>
        `
      )
      .join("");

    document.querySelectorAll(".rate-movie .star").forEach((star, index) => {
      star.addEventListener("click", async () => {
        const userRating = index + 1;

        try {
          await axios.post(
            `http://localhost:8080/movie-ai/backend/apis/rateMovie.php`,
            {
              movie_id: movieId,
              user_id: 1,
              rating: userRating,
            }
          );

          location.reload();
        } catch (error) {
          console.error("Error rating the movie:", error);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching movie data:", error);
  }
});
