// /api/proxy.js (in the Vercel project)
export default async (req, res) => {
    const apiUrl = 'https://my-quizapp-app.fyi/graphql';  // Your API URL
    const method = req.method;
    const headers = { ...req.headers };
    
    // Forward all headers and data to your backend API
    const response = await fetch(apiUrl, {
      method,
      headers,
      body: method === 'POST' ? JSON.stringify(req.body) : undefined,
    });
  
    res.status(response.status).json(await response.json());
  };
  