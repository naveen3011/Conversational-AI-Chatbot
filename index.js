const axios = require('axios');

// Set your OpenAI API key
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';

// Define the API endpoint
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

// Define the initial conversation messages
let messages = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'I am Naveen, I want to learn AI' },
  { role: 'assistant', content: 'Hello, Naveen. That is awesome! What do you want to know about AI?' },
  { role: 'user', content: 'What is NLP?' }
];
// Define the function to update the chat messages
function updateChat(messages, role, content) {
  messages.push({ role: role, content: content });
  return messages;
}

// Define the function to make the API request
async function makeAPIRequest() {
  try {
    const response = await axios.post(API_ENDPOINT, {
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 100 
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    });

    const assistantResponse = response.data.choices[0].message.content;
    console.log('Assistant:', assistantResponse);

    // Handle the assistant's response and update the conversation
    handleAssistantResponse(assistantResponse);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Define the function to handle the assistant's response
function handleAssistantResponse(response) {
  
  console.log('Please Enter the Prompt');

  // Get user input as a prompt for the next message
  getUserInput().then(prompt => {
    messages = updateChat(messages, 'user', prompt);

    // Update the conversation with the assistant's response
    messages = updateChat(messages, 'assistant', response);

    // Make the next API request
    makeAPIRequest();
  });
}

// Helper function to get user input from the console
function getUserInput() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question('', answer => {
      rl.close();
      resolve(answer);
    });
  });
}

// Start the chatbot
makeAPIRequest();
