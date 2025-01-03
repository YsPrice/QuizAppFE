// src/services/graphql.js

export const graphqlRequest = async (query, variables, authRequired = false) => {
  const headers = { "Content-Type": "application/json" };
  if (authRequired) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.error("No token found in localStorage");
    }
  }

  // Use the absolute proxy endpoint
  const endpoint = '/api/proxy/graphql'; // Correct absolute path

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  console.log("GraphQL Response:", result);

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data;
};

export default graphqlRequest;
