import graphqlRequest from "./graphql";

export const logInUser = async (email, password) =>{
    const query = `
    mutation LogIn($email: String!, $password: String!){
    logIn(email: $email, password: $password) {
        user {
    id
    email
    userName
        }
        token
        }
    }
    `;

    const variables = {email,password};
    try{
        const data = await graphqlRequest(query, variables); 
        return data.logIn
    }catch(error){
        console.error("Error in Sign In:", error);
        throw error;
    }

};

export const signUpUser = async (email, password, userName) => {
    const query = `
      mutation SignUp($email: String!, $password: String!, $userName: String!) {
        signUp(email: $email, password: $password, userName: $userName) {
          user {
            id
            email
            userName
          }
          token
        }
      }
    `;
  
    const variables = { email, password, userName };
  
    console.log("Request Variables:", variables); 
  
    try {
      const data = await graphqlRequest(query, variables);
      console.log("SignUp User Response:", data); 
      return data; 
    } catch (error) {
      console.error("Error in signUpUser:", error);
      throw error;
    }
  };
  
  export const logOutUser = async () => {
    const query = `
      mutation {
        logOut {
          message
        }
      }
    `;
    try {
      const data = await graphqlRequest(query, {}, true);
      console.log("Log Out Response:", data); // Debug
      return { message: data.logOut.message }; // Return a plain object
    } catch (err) {
      console.error("Error in Log Out:", err);
      throw err;
    }
  };
  