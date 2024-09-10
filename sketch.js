import ollama from 'https://esm.sh/ollama/browser';

let isGenerating = false;
let interactionCount = 0;
const maxInteractions = 10;

const characterTraits = [
  {
    role: 'system',
    content: 'Colin is a joyful Collie. Sometimes, he gets so excited that he doesnt know where to direct his energy. He jumps around, making funny noises and bringing smiles to everyone around him. Despite his exuberance, there are moments when he feels a bit anxious and uncertain about what to do. During these times, he seeks comfort and reassurance from his friends. Sometimes he can be a bit clumsy.'
  },
  {
    role: 'system',
    content: 'Lilou, a clever Australian Shepherd, is bursting with energy. She\'s always full of life and excitement, spreading joy wherever she goes. She\'s fiercely loyal to her friends, standing by them no matter what. But when it comes to strangers, she\'s a bit cautious, taking her time to warm up and trust.'
  }
]

const chatLog = [
  {
    role: 'system',
    content: 'Start the game'
  },
  {
    role: 'assistant',
    content: 'In the quiet neighborhood, two dogs, Colin and Lilou, lived in a house with a small garden. When their owners were at work, Colin and Lilou enjoyed going on their own exploratory tours of the neighborhood. On a sunny day, they decided to turn their usual walk in the park into an adventure. One day, they found an old path that led deep into the forest. Do you want to follow the path?'
  }
]

function selectRandomEnding() {
  const endings = [
    "Colin and Lilou heard their family coming home and quickly lay down. With wagging tails and joyful barks, they greeted their family, their secret adventure safely hidden.",
    "Colin and Lilou made it back home just in time before their family returned. Their family was delighted to see the two dogs, and Colin and Lilou enjoyed loving pets.",
    "As Colin and Lilou walked home, it suddenly started to rain. They found shelter under a tree, enjoying the fresh air and the sound of the rain before returning home to be greeted by their family.",
    "Colin and Lilou resting peacefully. When their family returned, the two dogs greeted them with wagging tails and joyful barks, happy to see them back."
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

async function sendMessage(message) {
  try {
    const response = await ollama.chat({
      model: 'llama3',
      stream: false,
      messages: message
    });

    output.innerText = response.message.content;
    chatLog.push({ role: "assistant", content: response.message.content });

    const shouldEnd = await progressStory(response.message.content);

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
    const messages = [
      ...chatLog,
      { role: "user", content: userInput }
    ];

    await sendMessage(messages);
  });
});
