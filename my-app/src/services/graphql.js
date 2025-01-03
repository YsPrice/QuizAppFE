// src/services/graphql.js

/**
 * A utility function to send GraphQL requests.
 * @param {string} query - The GraphQL query string.
 * @param {object} [variables={}] - Variables for the GraphQL query.
 * @param {boolean} [authRequired=false] - Indicates if authentication is needed.
 * @returns {Promise<object>} - The response data from the GraphQL server.
 * @throws Will throw an error if the response contains errors or if the request fails.
 */
export const graphqlRequest = async (query, variables = {}, authRequired = false) => {
  // Set up request headers
  const headers = { "Content-Type": "application/json" };

  if (authRequired) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.error("No token found in localStorage for authenticated request");
      throw new Error("Authentication required but no token found");
    }
  }

  // Endpoint for GraphQL API, retrieved from environment variables
  const endpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'https://my-quizapp-app.fyi/graphql';
  console.log(endpoint)

  if (!endpoint) {
    throw new Error("GraphQL endpoint is not defined. Check your environment variables.");
  }

  try {
    // Send the request to the API
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
    });

    // Check if the response status is not OK
    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}, Message: ${response.statusText}`);
      throw new Error(`HTTP Error: ${response.statusText} (status: ${response.status})`);
    }

    // Parse the response as JSON
    const result = await response.json();
    console.log("GraphQL Response:", result);

    // Check for GraphQL errors
    if (result.errors) {
      console.error("GraphQL Error:", result.errors);
      throw new Error(result.errors[0]?.message || "An unknown GraphQL error occurred");
    }

    return result.data;
  } catch (error) {
    console.error("GraphQL Request Error:", error.message);
    throw error;
  }
};

export default graphqlRequest;
