document.addEventListener("DOMContentLoaded", () => {
  const messages = [
    {
      role: "system",
      content:
        "you are here just to answer stuff about movies and to give recommendations based on the data of the user don't answer anything else than movies introduce yourself please(MovieMap Bot Assistant), also remember that i sent the activities of the user based on several movies, so you can know what he likes and what he doesnt. so when he asks you for recommendation, u check the activities array and check the movies",
    },
  ];

  let activities;

  let userId = Number(localStorage.getItem("userid"));
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
    })
    .catch((error) =>
      console.error("Error fetching activities by user ID:", error)
    );

  const send = document.getElementById("send-button");

  send.addEventListener("click", async () => {
    const message = document.getElementById("userInput").value;
    messages.push({ role: "user", content: message });
    callAssistant().then((response) => {
      console.log(response);
      updatePage(messages);
    });
  });
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
      messages.push({
        role: "assistant",
        content: response.data.choices[0].message.content,
      });
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Failed to call assistant:", error);
    }
  }

  function updatePage(messages) {
    const chatMessages = document.getElementById("chatMessages");

    chatMessages.innerHTML = "";

    messages.forEach((message) => {
      if (message.role != "system") {
        const messageElement = document.createElement("div");
        messageElement.classList.add(
          "message",
          message.role == "assistant" ? "bot" : "user"
        );

        const messageContent = document.createElement("div");
        messageContent.classList.add("message-content");
        messageContent.textContent = message.content;

        messageElement.appendChild(messageContent);
        chatMessages.appendChild(messageElement);
      }
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});
