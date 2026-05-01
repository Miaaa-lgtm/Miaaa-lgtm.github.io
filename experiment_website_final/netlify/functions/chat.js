exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };
    
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }
    
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }
    
    const apiKey = process.env.DOUBAO_API_KEY;
    const endpointId = process.env.DOUBAO_ENDPOINT_ID;
    
    if (!apiKey || !endpointId) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: '环境变量未配置' }) };
    }
    
    try {
        const body = JSON.parse(event.body);
        const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
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
        
        const data = await res.json();
        return { statusCode: 200, headers, body: JSON.stringify(data) };
    } catch (e) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
    }
};