export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (url.pathname === '/chat') {
      if (request.method === 'OPTIONS') {
        return handleOptions();
      }
      if (request.method === 'POST') {
        return handleChat(request, env);
      }
      return new Response('Method Not Allowed', { status: 405 });
    }
    
    return env.ASSETS.fetch(request);
  },
};

function handleOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}

async function handleChat(request, env) {
  try {
    const body = await request.json();
    const apiKey = env.DOUBAO_API_KEY;
    const endpointId = env.DOUBAO_ENDPOINT_ID;
    
    if (!apiKey || !endpointId) {
      return new Response(JSON.stringify({ error: '环境变量未配置' }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: endpointId,
        messages: body.messages
      })
    });
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}