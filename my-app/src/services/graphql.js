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

  const response = await fetch(import.meta.env.VITE_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql", {
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

export default graphqlRequest