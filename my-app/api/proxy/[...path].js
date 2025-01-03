// api/proxy/[...path].js

export default async function handler(req, res) {
    const { path } = req.query; // Captures all subpaths
    const backendPath = Array.isArray(path) ? path.join('/') : path; // Reconstruct the path
  
    // Construct the backend URL by appending the captured path and query parameters
    const backendUrl = `http://myquizapp.34.54.208.253.nip.io/${backendPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;
  
    console.log(`Proxying request to: ${backendUrl}`);
    console.log(`Request Method: ${req.method}`);
    console.log(`Request Headers:`, req.headers);
  
    try {
      const response = await fetch(backendUrl, {
        method: req.method,
        headers: {
          ...req.headers,
          host: 'myquizapp.34.54.208.253.nip.io', // Ensure Host header matches backend expectation
          // Uncomment and set if your backend requires an API key
          // 'x-api-key': process.env.BACKEND_API_KEY,
        },
        body: req.method === 'GET' || req.method === 'HEAD' ? null : req.body,
      });
  
      console.log(`Backend Response Status: ${response.status}`);
      console.log(`Backend Response Headers:`, response.headers.raw());
  
      // Forward response headers to the client
      response.headers.forEach((value, key) => {
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
  