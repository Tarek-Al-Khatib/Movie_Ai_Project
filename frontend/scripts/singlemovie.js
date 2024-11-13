const time = Date.now();

document.addEventListener("DOMContentLoaded", async () => {
  const movieId = localStorage.getItem("movie-id");

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

    const averageRatingResponse = await axios.get(
      `http://localhost:8080/movie-ai/backend/apis/getAverageRating.php?movie_id=${movieId}`
    );
    const averageRatingData = averageRatingResponse.data;
    console.log(averageRatingData);
    document.querySelector(
      "h1"
    ).innerHTML = `${movieData.title} <span class="rating">${averageRatingData.average_rating}<span class="star">★</span></span> <span class="bookmark">🔖</span>`;
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
              user_id: Number(localStorage.getItem("userid")),
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

window.addEventListener("beforeunload", () => {
  let differenceTime = Date.now() - time;

  async function addOrUpdateActivity(
    user_id,
    movie_id,
    activity_time = 1,
    nbOfClicks = 1
  ) {
    try {
      const response = await axios.post(
        "http://localhost:8080/movie-ai/backend/apis/add_activity.php",
        {
          user_id: user_id,
          movie_id: movie_id,
          activity_time: activity_time,
          nbOfClicks: nbOfClicks,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        console.log(response.data.message);
      } else {
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      console.error("Failed to add or update activity:", error);
    }
  }

  addOrUpdateActivity(
    Number(localStorage.getItem("userid")),
    Number(localStorage.getItem("movie-id")),
    differenceTime,
    1
  );
});
