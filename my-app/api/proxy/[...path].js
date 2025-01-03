// For Next.js projects: pages/api/proxy/[...path].js
// For standard Vercel serverless functions: api/proxy/[...path].js

export const config = {
    api: {
      bodyParser: false, // Disable automatic body parsing
    },
  };
  
  export default async function handler(req, res) {
    // Log the entire query object for debugging
    console.log('Request Query:', req.query);
  
    // Access the '...path' key directly
    const backendPath = req.query['...path'];
  
    // Log the extracted backend path
    console.log('Backend Path:', backendPath);
  
    // Validate the backendPath
    if (!backendPath) {
      console.error('No path provided in the request.');
      res.status(400).json({ error: 'Bad Request: Missing path parameter.' });
      return;
    }
  
    // Construct the backend URL
    const backendUrl = `http://myquizapp.34.54.208.253.nip.io/${backendPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;
  
    console.log(`Proxying request to: ${backendUrl}`);
    console.log(`Request Method: ${req.method}`);
    console.log(`Request Headers:`, req.headers);
  
    try {
      // Read the raw body from the request
      const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => {
          data += chunk;
        });
        req.on('end', () => resolve(data));
        req.on('error', err => reject(err));
      });
  
      // Exclude headers that can cause issues when forwarding
      const { host, connection, 'content-length': contentLength, ...forwardedHeaders } = req.headers;
  
      // Log the forwarded headers
      console.log('Forwarded Headers:', forwardedHeaders);
  
      // Forward the request to the backend
      const response = await fetch(backendUrl, {
        method: req.method,
        headers: {
          ...forwardedHeaders,
          // Uncomment and set if your backend requires an API key
          // 'x-api-key': process.env.BACKEND_API_KEY,
        },
        body: req.method === 'GET' || req.method === 'HEAD' ? null : body,
      });
  
      console.log(`Backend Response Status: ${response.status}`);
      console.log(`Backend Response Headers:`, response.headers);
  
      // Forward response headers to the client, excluding problematic headers
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() === 'transfer-encoding') return;
        res.setHeader(key, value);
      });
  
      const contentType = response.headers.get('content-type');
      let data;
  
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        res.status(response.status).json(data);
      } else {
        data = await response.text();
        res.status(response.status).send(data);
      }
  
      console.log(`Backend Response Body:`, data);
    } catch (error) {
      console.error('Proxy error:', error);
      res.status(500).json({ error: 'Proxy error', details: error.message });
    }
  }
  