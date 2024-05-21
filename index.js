/**
 * This is a simple example of how you can import
 * the ollama sdk and work with that
 * import ollama from "https://esm.sh/ollama/browser"
 * add the code below to your buttons click event listener
 * const respone = await ollama.chat({messages: [{role: 'user', content: 'What is the capital of the United States?'}]});
 * console.log(response);
 */
// ----------------------------
/**
 * There might be another way. The platform val.town
 * allows free requests to openai api. https://www.val.town/v/std/openai
 * Limits are:
 * - Usage Quota: We limit each user to 10 requests per minute.
 * - Features: Chat completions is the only endpoint available.
 * - There is no streaming support
 *
 * This might be enough for our usecase.
 * Do make this easier @ff6347 wrote this simple wrapper class
 * that you can use to interact with val.town openai api
 * mimicing the ollama sdk.
 * It is an esm module so you need to include type="module" in your script tag
 * <script type="module" src="index.js"></script>
 */

// import the wrapper class
import { LLM } from './llm.js';

// create an instance of the class
// you need to insert the run url for your val.town openai api
// @ff6347 will instruct you on how to get this

const llm = new LLM({
  host: '<insert run url for your val.town openai api here>',
});

// get the button#run element from the index.html
const chatButton = document.getElementById('run');

// add a click event listener to the button that runs the async function
chatButton.addEventListener('click', async () => {
  // some options for the chat
  const format = 'json'; // we want json output
  // we set the seed so we get always the same output
  // we set the temperature which controls the creativity of the model
  const options = {
    seed: 42,
    temperature: 0.5,
  };
  // the messages that we want to send to the model
  // allowed are 'system', 'assistant' and 'user' role for the messages
  const messages = [
    {
      role: 'system',
      content:
        'You are a helpful assistant. Always repond in JSON and only JSON',
    },
    { role: 'user', content: 'What is the capital of the United States?' },
  ];

  try {
    // now we make the call to the api.
    // we wrap it in a try catch block to catch any errors
    const response = await llm.chat({ format, options, messages });
    console.log(response);
  } catch (error) {
    // we had an error lets handle it
    console.error(error);
  }
});
