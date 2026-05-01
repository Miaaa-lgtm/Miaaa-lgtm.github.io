module.exports = (req, res) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };
    
    if (req.method === 'OPTIONS') {
        res.status(200).set(headers).send('');
        return;
    }
    
    if (req.method !== 'POST') {
        res.status(405).set(headers).send('Method Not Allowed');
        return;
    }
    
    const apiKey = process.env.DOUBAO_API_KEY;
    const endpointId = process.env.DOUBAO_ENDPOINT_ID;
    
    if (!apiKey || !endpointId) {
        res.status(500).set(headers).json({ error: '环境变量未配置' });
        return;
    }
    
    fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${apiKey}` 
        },
        body: JSON.stringify({ 
            model: endpointId, 
            messages: req.body.messages 
        })
    })
    .then(res => res.json())
    .then(data => {
        res.status(200).set(headers).json(data);
    })
    .catch(e => {
        res.status(500).set(headers).json({ error: e.message });
    });
};