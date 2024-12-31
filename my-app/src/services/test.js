import graphqlRequest from "./graphql";

const testConnection = async () => {
  const query = `
    query {
      users {
        id
        email
        userName
      }
    }
  `;
  try {
    const data = await graphqlRequest(query);
    console.log("Test Connection Success:", data);
  } catch (error) {
    console.error("Test Connection Failed:", error.message);
  }
};

export default testConnection;
