const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

// API Gateway endpoint URL
//const apiGatewayUrl = 'https://9bren37eub.execute-api.us-west-2.amazonaws.com/default/LangChainKnnWeiTest';
const apiGatewayUrl = 'https://9bren37eub.execute-api.us-west-2.amazonaws.com/default/RagChainQA-peiyaow';
//const apiGatewayUrl = 'https://9ahpv9mlee.execute-api.us-west-2.amazonaws.com/default/RagChainQA-peiyaow';

app.get('/', (req, res) => {
  res.send(`
    <style>
    .center {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 90vh;
      width: 80vw;
      margin: 0 auto;

      flex-direction: column;
    }

    .chat {
      overflow-y: scroll;
      margin-bottom: 20px;
      padding: 10px;
      background-color: #f2f2f2;

      width: 100%;

      flex-grow: 1;

      box-sizing: border-box;
    }

    .textbox {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }

    input[type="text"] {
      padding: 10px;
      border: 2px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
      flex-grow: 1;
    }

    button {
      margin-left: 10px;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      background-color: #4CAF50;
      color: white;
      font-size: 16px;
      cursor: pointer;
      flex-grow: 1;
    }


    .message-container {
      position: relative;
      width: 100%;
      background-color: #e6e6e6;
    }


    .message {
      background-color: #e6e6e6;
      border-radius: 6px;
      padding: 8px;
      margin-bottom: 6px;
      font-size: 16px;
    }

    .thinking-message {
      font-size: 20px;
      width: 100%;
      font-style: italic;
      text-align: center;
      color: blue;
    }

    .message-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.7);
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      cursor: pointer;
    }



    .message-container:hover .message-overlay {
      opacity: 0;
    }

    .message-overlay-text {
      color: #fff;
      font-size: 16px;
      z-index: 9999;
    }

    .image-list {
      overflow-x: scroll;
      white-space: nowrap;
      padding: 10px;
      display: flex; /* Use flexbox */

    }

    .image-card {
      flex: 0 0 200px; /* Set a fixed width for each card */
      height: 300px;
      max-width: 200px;
      margin-right: 10px;
      border: 1px solid #ccc;
      border-radius: 6px;
      background-color: black; /* Set the background color to black */
      color: white; /* Set the text color to white */
      
      text-align: center;
      padding: 10px;
      display: flex; /* Use flexbox */
      flex-direction: column; /* Stack image and text vertically */
      justify-content: center; /* Center contents vertically */

    }


    .image-card p {
      margin: 5px 0;
      flex: 1; /* Allow the caption to grow, and take available space */
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .image-card span {
      font-weight: bold;
      flex: 1; /* Allow the title to grow, and take available space */
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: wrap;
    }

    .image-card img {
      max-width: 100%;
      border-radius: 6px;
    }



    /* Play button overlay styles */
    .play-overlay {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      position: absolute;
      opacity: 0;
    }

    .play-button {
      color: white;
      font-size: 24px;
    }

    .playable-container {
      max-width: 100%;
      border-radius: 6px;
      position: relative;
    }


    .playable-container:hover .play-overlay {
      opacity: 1;
    }

    .blue {
      color: blue;
    }


    .green {
      color: green;
    }

    .red {
      color: red;
    }
  </style>

  <div class="center">
    <div class="chat" id="chatContainer">
    </div>
    <div class="textbox">
    <input type="text" id="question" placeholder="Enter your question" onkeydown="handleKeyDown(event)">
    <button id="submitButton" onclick="chat()">Send</button>
    </div>
  </div>

    <script>
    function uuidv4() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    }
    var session_id = uuidv4();
        let CONTEXT_ID = "9";

        let audoplaying = {};

      const thinkingMessage = document.createElement("div");
      thinkingMessage.textContent = "Thinking...";
      thinkingMessage.classList.add("thinking-message");

      function chat() {
        const question = document.getElementById('question').value;

        const chatContainer = document.getElementById("chatContainer");






        const newMessage = document.createElement("div");
        newMessage.classList.add("message");

        const firstHalf = document.createElement("span");
        firstHalf.classList.add("green");
        firstHalf.textContent = "You: ";

        const secondHalf = document.createElement("span");
        secondHalf.textContent = question;


      newMessage.appendChild(firstHalf);
      newMessage.appendChild(secondHalf);

            chatContainer.appendChild(newMessage);


        document.getElementById("question").value = "";


      const submitButton = document.getElementById("submitButton");
      submitButton.disabled = true;


      chatContainer.appendChild(thinkingMessage);


        //const payload = {
        //  "profile": "openai.chatbot",
        //  "payload": "{\\\"session_id\\\": \\\"" + session_id + "\\\", \\\"query\\\": [\\\"" + question + "\\\"]}",
        //};

        const payload = {
          "profile": "openai.chatbot",

          "payload": "{\\\"session_id\\\": \\\"" + session_id + "\\\", \\\"prompt\\\": \\\"" + question + "\\\", \\\"context_id\\\": \\\"" + CONTEXT_ID + "\\\"}",
        
        };

        sendMessage(payload);
        
        
      }


    function sendMessage(payload) {
      fetch('${apiGatewayUrl}', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
          .then(response => response.json())
          .then(data => {

            let rJson = JSON.parse(data["raw_response"]);
            const chatContainer = document.getElementById("chatContainer");


          for (let i of rJson) {
              console.log(i);


                const newMessageContainer = document.createElement("div");
                newMessageContainer.classList.add("message-container");

                const messageOverlay = document.createElement("div");
                messageOverlay.classList.add("message-overlay");

                const overlayText = document.createElement("div");
                let hint = "<center><u>Top document results</u><br>";

                //for (let x of data.raw_response.source_documents) {
                //  hint += JSON.parse(x)['source'];
                //  hint += "<br>";
                //
              //}

                hint += "</center>";
                overlayText.innerHTML = hint;
                overlayText.classList.add("message-overlay-text");


                    const newMessage = document.createElement("div");
                    newMessage.classList.add("message");


                const firstHalf = document.createElement("span");
                firstHalf.classList.add("red");
                firstHalf.textContent = "ChatBot: ";


                const secondHalf = document.createElement("span");
                secondHalf.textContent = i.response;

              newMessage.appendChild(firstHalf);
              newMessage.appendChild(secondHalf);

                messageOverlay.appendChild(overlayText);
                newMessageContainer.appendChild(newMessage);
                newMessageContainer.appendChild(messageOverlay);

                    chatContainer.appendChild(newMessageContainer);

                    submitButton.disabled = false;
                    newMessageContainer.scrollIntoView({behavior: "smooth"});
                    try {
                chatContainer.removeChild(thinkingMessage);
              }catch (exceptionVar) {
}



              if (i.recommendedContent.length > 0) {

                                      const newMessageContainer = document.createElement("div");
                                      newMessageContainer.classList.add("message-container");



                                          const newMessage = document.createElement("div");
                                          newMessage.classList.add("image-list");

                                      for (let content of i.recommendedContent) {
                                        const imgcontainer = document.createElement("div");
                                          imgcontainer.classList.add("image-card");


                                        const imgc = document.createElement("div");
                                        imgc.classList.add("playable-container");
                                        const img = document.createElement("img");
                                          img.src = content.art;


      // Create play button overlay
      const playOverlay = document.createElement("div");
      playOverlay.classList.add("play-overlay");
      playOverlay.innerHTML = '<i class="play-button">&#9658;</i>'; // Unicode character for play symbol

      // Handle click event on play button overlay
      let playing = false;
      playOverlay.addEventListener("click", () => {
        console.log('playing ' + content.mediaUrl);
        if (playing) {
          playing = false;
          if (audoplaying[content.mediaUrl]) {
          audoplaying[content.mediaUrl].pause();
          }
      playOverlay.innerHTML = '<i class="play-button">&#9658;</i>'; // Unicode character for play symbol
        } else {
          playing = true;
          if (!audoplaying[content.mediaUrl]) {
            audoplaying[content.mediaUrl] = new Audio(content.mediaUrl);
          }
          audoplaying[content.mediaUrl].play();
      playOverlay.innerHTML = '<i class="play-button">&#9616;&nbsp;&#9612;</i>'; // Unicode character for play symbol
        }
      });
                                          imgc.appendChild(playOverlay);
                                          imgc.appendChild(img);

                                          imgcontainer.appendChild(imgc);

                                        const br = document.createElement("br");
                                          imgcontainer.appendChild(br);


                                          const title = document.createElement("span");
                                          title.textContent = content.fullEpisodeName;
                                          imgcontainer.appendChild(title);




                                          newMessage.appendChild(imgcontainer);
                                      }


                                      newMessageContainer.appendChild(newMessage);

                                          chatContainer.appendChild(newMessageContainer);

                                          submitButton.disabled = false;



                    newMessageContainer.scrollIntoView({behavior: "smooth"});
                                          try {
                                      chatContainer.removeChild(thinkingMessage);
                                    }catch (exceptionVar) {
                      }


              }

          
              }
                  })
                  .catch(error => {
                    console.error('Error:', error.message);
                    submitButton.disabled = false;
                    try {
                chatContainer.removeChild(thinkingMessage);
              }catch (exceptionVar) {
}
                  });
    }

    function handleKeyDown(event) {
      if (event.keyCode === 13) {
        event.preventDefault(); // Prevent form submission
        chat();
      }
    }

    function initChat() {

        const payload = {
          "profile": "openai.chatbot",

          "payload": "{\\\"session_id\\\": \\\"" + session_id + "\\\", \\\"prompt\\\": \\\"\\\", \\\"context_id\\\": \\\"" + CONTEXT_ID + "\\\"}",
        
        };
        console.log("init chat")
        sendMessage(payload);
    }

    initChat();
    </script>
  `);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
