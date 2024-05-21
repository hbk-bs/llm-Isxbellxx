import Ajv from 'https://esm.sh/ajv@8.13.0';

const sharedHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
};
const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

const schema = {
  type: 'object',
  properties: {
    temperature: { type: 'number' },
    seed: { type: 'number' },
    messages: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          role: { enum: ['user', 'assistant', 'system'] },
          content: { type: 'string' },
        },
        required: ['role', 'content'],
      },
    },
  },
  required: ['messages'],
};

const validate = ajv.compile(schema);

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response('', {
      headers: sharedHeaders,
    });
  }

  // we need to do some sanity checks on the request
  // to make sure it's a POST request
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  // we make sure that we have a content type of application/json
  const contentType = req.headers.get('Content-Type');
  if (!contentType || !contentType.includes('application/json')) {
    return new Response('Unsupported Media Type', { status: 415 });
  }
  // now we need to test if the is a valid json
  let body;
  try {
    body = await req.json();
  } catch (error: unknown) {
    console.error('Error parsing request body:', error);
    return new Response('Invalid JSON', { status: 400 });
  }

  const valid = validate(body);
  if (!valid) {
    console.error('Invalid request body:', validate.errors);
    return new Response(JSON.stringify(validate.errors), {
      status: 400,
      headers: { ...sharedHeaders, 'content-type': 'application/json' },
    });
  }

  // const completion = await openai.chat.completions.create({
  //   ...body,
  //   model: "gpt-3.5-turbo",
  //   // max_tokens: 30,
  // });
  const completion = {
    choices: [
      {
        message: 'Hello, how can I help you today?',
      },
    ],
  };

  console.log(completion.choices[0].message);

  return new Response(JSON.stringify({ completion }), {
    headers: { ...sharedHeaders, 'content-type': 'application/json' },
  });
}

Deno.serve(handler);
