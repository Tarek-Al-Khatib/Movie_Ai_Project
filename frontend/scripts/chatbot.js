document.addEventListener("DOMContentLoaded", () => {
  const messages = [
    {
      role: "user",
      content:
        "you are here just to answer stuff about movies and to give recommendations based on the data of the user don't answer anything else than movies introduce yourself please(MovieMap Bot Assistant)",
    },
  ];
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
          model: "gpt-4o",
          messages: messages,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`, // Replace with your actual API key
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
    });

    // Scroll to the bottom to show the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});
