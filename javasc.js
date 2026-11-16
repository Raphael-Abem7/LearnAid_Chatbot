const promptBox = document.getElementById("question");
const sendButton = document.getElementById("send-btn");
const chatBody = document.getElementById("chat");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");

function newMessage(sender, message){
    const chatBubble = document.createElement("div");
    chatBubble.classList.add("message");
    chatBubble.classList.add(sender + "_message");
    chatBubble.textContent = message;
    chatBody.scrollTop = chatBody.scrollHeight;
    chatBody.appendChild(chatBubble);
    return chatBubble;
}

sendButton.addEventListener("click", async () => {
    const prompt = promptBox.value.trim();
    if (prompt === "") return;

    newMessage("user", prompt);
    promptBox.value = "";
    sendButton.disabled = true;
    title.textContent = "";
    subtitle.textContent = "";

    const thinkBubble = newMessage("aid", "Thinking... Give me a moment.");

    try {
        const response = await fetch("http://127.0.0.1:8000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: prompt })
        });

        console.log("HTTP status:", response.status);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let fullText = "";
        let firstChunk = true;

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            if (!chunk) continue;

            if (firstChunk) {
                thinkBubble.textContent = "";
                firstChunk = false;
            }

            fullText += chunk;

            thinkBubble.innerHTML = DOMPurify.sanitize(marked.parse(fullText));
            chatBody.scrollTop = chatBody.scrollHeight;
        }

        const remainingText = decoder.decode();
        if (remainingText) {
            if (firstChunk) {
                thinkBubble.textContent = "";
            }
            fullText += remainingText;
            thinkBubble.innerHTML = DOMPurify.sanitize(marked.parse(fullText));
        }

    } catch (error) {
        console.error("CHAT ERROR:", error);
        thinkBubble.textContent = "Error: " + error.message;
    } finally {
        sendButton.disabled = false;
    }
});

promptBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") sendButton.click();
});