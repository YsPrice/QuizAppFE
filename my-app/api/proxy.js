// api/proxy.js

export default async function handler(req, res) {
    // Define your backend URL
    const backendUrl = 'http://34.54.208.253.nip.io' + req.url;
  
    try {
      // Forward the incoming request to the backend
      const response = await fetch(backendUrl, {
        method: req.method,
        headers: {
          ...req.headers,
          host: '34.54.208.253.nip.io', // Ensure the Host header matches your backend
        },
        body: req.method === 'GET' || req.method === 'HEAD' ? null : req.body,
      });
  
      // Extract response headers
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
  
      // Set the response status and headers
      res.status(response.status);
      Object.entries(headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
  
      // Stream the response body
      const data = await response.text();
      res.send(data);
    } catch (error) {
      console.error('Proxy error:', error);
      res.status(500).json({ error: 'Proxy error' });
    }
  }
  