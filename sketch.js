// import ollama from 'https://esm.sh/ollama/browser';
//@ts-check
import { LLM } from "./llm.js";

// instructions:
//
// 1. got val.town
// 2. create an account using your github account
// 3. go to this val https://www.val.town/v/ff6347/openai_api
// 4. fork it (little button saying fork on the top right)
// 5. in your fork below the code find the url for the endpoint. Should be something like https://<YOUR USERNAME HERE>-openai_api.web.val.run
// 6. Add it to the host below
const host = "<ADD YOUR VAL TOWN API URL HERE>";
const llm = new LLM({ host });
let isGenerating = false;
let interactionCount = 0;
const maxInteractions = 10;

const characterTraits = [
  {
    role: "system",
    content:
      "Colin is a joyful Collie. Sometimes, he gets so excited that he doesnt know where to direct his energy. He jumps around, making funny noises and bringing smiles to everyone around him. Despite his exuberance, there are moments when he feels a bit anxious and uncertain about what to do. During these times, he seeks comfort and reassurance from his friends. Sometimes he can be a bit clumsy.",
  },
  {
    role: "system",
    content:
      "Lilou, a clever Australian Shepherd, is bursting with energy. She's always full of life and excitement, spreading joy wherever she goes. She's fiercely loyal to her friends, standing by them no matter what. But when it comes to strangers, she's a bit cautious, taking her time to warm up and trust.",
  },
];

const chatLog = [
  {
    role: "system",
    content: "Start the game",
  },
  {
    role: "assistant",
    content:
      "In the quiet neighborhood, two dogs, Colin and Lilou, lived in a house with a small garden. When their owners were at work, Colin and Lilou enjoyed going on their own exploratory tours of the neighborhood. On a sunny day, they decided to turn their usual walk in the park into an adventure. One day, they found an old path that led deep into the forest. Do you want to follow the path?",
  },
];

function selectRandomEnding() {
  const endings = [
    "Colin and Lilou heard their family coming home and quickly lay down. With wagging tails and joyful barks, they greeted their family, their secret adventure safely hidden.",
    "Colin and Lilou made it back home just in time before their family returned. Their family was delighted to see the two dogs, and Colin and Lilou enjoyed loving pets.",
    "As Colin and Lilou walked home, it suddenly started to rain. They found shelter under a tree, enjoying the fresh air and the sound of the rain before returning home to be greeted by their family.",
    "Colin and Lilou resting peacefully. When their family returned, the two dogs greeted them with wagging tails and joyful barks, happy to see them back.",
  ];
  return endings[Math.floor(Math.random() * endings.length)];
}

async function progressStory(userInput) {
  interactionCount++;
  // Logic to determine if the story should end based on userInput
  // For example, specific keywords or phrases in userInput might trigger an early ending
  if (userInput.includes("go home") || userInput.includes("end adventure")) {
    return true; // Signal to end the story
  }
  return false; // Continue the story
}

async function sendMessage(message, output, button) {
  try {
    const response = await llm.chat({
      format: "text",
      options: {
        seed: Math.floor(Math.random() * 1000),
        temperature: 0.7,
      },
      messages: message,
    });

    console.log(response);
    const { content } = response.completion.choices[0].message;
    output.innerText = content;

    chatLog.push({ role: "assistant", content });

    const shouldEnd = await progressStory(content);

    if (shouldEnd || interactionCount >= maxInteractions) {
      output.innerText = selectRandomEnding(); // Select a random ending
      button.disabled = true; // Disable button to prevent further input
    }
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const input = document.getElementById("input");
  const output = document.getElementById("output");
  const button = document.getElementById("send");

  output.innerText = chatLog[1].content;

  button.addEventListener("click", async () => {
    const userInput = input.value;
    const messages = [...chatLog, { role: "user", content: userInput }];
    isGenerating = true;
    button.innerHTML = "sending...";
    await sendMessage(messages, output, button);
    isGenerating = false;
    button.innerHTML = "send";
  });
});
