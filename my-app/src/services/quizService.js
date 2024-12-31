import graphqlRequest from "./graphql";
export const fetchQuizzes = async ()=>{
    const query = `
    query {
    quizzes {
    id
    title
    difficulty
    status
    createdBy {
    id
   userName
        }
      }
    }
    `;
    return await graphqlRequest(query, {}, true);
};

export const fetchQuizById = async (id) =>{
    const query = `
    query ($id: ID!){
    quiz(id: $id){
    id
    title
    difficulty
    status
         questions {
            id
            content
            options {
              id
              content
              isCorrect
            }
          }
    createdBy{
        id
        email
    }
    }
    }
    `;
    const variables = { id };
    return await graphqlRequest(query, variables, true);
};
export const createQuiz = async (title, difficulty = null, status = "DRAFT") => {
    const mutation = `
      mutation CreateQuiz($title: String!, $difficulty: String, $status: QuizStatus!) {
        createQuiz(title: $title, difficulty: $difficulty, status: $status) {
          id
          title
          difficulty
          status
          createdBy {
            id
            email
          }
        }
      }
    `;
    const variables = { title, difficulty,  status: status.toUpperCase() }; 
    console.log("Sending variables:", variables); // Debugging
    return await graphqlRequest(mutation, variables, true);
  };
  

export const editQuiz = async (id,title,difficulty,status) => {
    const mutation =`
    mutation EditQuiz($id: ID!, $title: String, $difficulty: String, $status: QuizStatus!){
    editQuiz( id: $id, title: $title, difficulty: $difficulty, status: $status){
    id
    title
    difficulty
    status
    createdBy{
    id
    email
    }
    }
    }
    `;
    const variables = {id, title, difficulty, status};
    return await graphqlRequest(mutation,variables,true)
};


export const deleteQuiz = async (id) => {
    const mutation = `
      mutation DeleteQuiz($id: ID!) {
        deleteQuiz(id: $id) {
          message
        }
      }
    `;
    const variables = { id };
    return await graphqlRequest(mutation, variables, true);
  };
  export const fetchSavedQuizzes = async () => {
    const query = `
      query {
        getSavedQuizzes {
          id
          title
          difficulty
          status
          createdBy {
            id
            userName
          }
        }
      }
    `;
    return await graphqlRequest(query, {}, true);
  };
  
  export const fetchQuizzesTaken = async () => {
    const query = `
      query {
        getQuizzesTaken {
          id
          title
          difficulty
          status
          createdBy {
            id
            userName
          }
        }
      }
    `;
    return await graphqlRequest(query, {}, true);
  };
  
  export const saveQuiz = async (quizId) => {
    const mutation = `
      mutation SaveQuiz($quizId: ID!) {
        saveQuiz(quizId: $quizId) {
          id
          savedQuizzes
        }
      }
    `;
    const variables = { quizId };
    return await graphqlRequest(mutation, variables, true);
  };
  

export const unsaveQuizAPI = async (quizId) => {
    const mutation = `
      mutation unsaveQuiz($quizId: ID!) {
        unsaveQuiz(quizId: $quizId) {
          savedQuizzes
        }
      }
    `;
    const variables = { quizId };
    return await graphqlRequest(mutation, variables, true);
  };


export const completeQuizAPI = async (quizId) => {
  const mutation = `
    mutation CompleteQuiz($quizId: ID!) {
      completeQuiz(quizId: $quizId) {
        quizzesTaken
      }
    }
  `;

  const variables = { quizId };

  try {
    const response = await graphqlRequest(mutation, variables, true);
    return response.completeQuiz;
  } catch (error) {
    console.error("Error in completeQuizAPI:", error);
    throw error;
  }
};

  export const getCreatedQuizzesAPI = async (userId) => {
    const query = `
      query ($userId: ID!) {
        getCreatedQuizzes(userId: $userId) {
          id
          title
          difficulty
          status
          createdBy {
            id
            userName
          }
        }
      }
    `;
    const variables = { userId };
    return await graphqlRequest(query, variables, true);
  };