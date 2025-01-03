// api/proxy/test-connection.js

export default async function handler(req, res) {
    const backendUrl = 'http://myquizapp.34.54.208.253.nip.io/graphql';
  
    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ __typename }' }),
      });
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Test Connection Error:', error);
      res.status(500).json({ error: 'Test connection failed', details: error.message });
    }
  }
  