import graphqlRequest from './graphql'; 



export const fetchQuestions = async (quizId) => {
    const query = `
      query GetQuestions($quizId: ID!) {
        questions(quizId: $quizId) {
          id
          content
          options {
            id
            content
            isCorrect
          }
        }
      }
    `;
    const variables = { quizId };
  
    try {
      const data = await graphqlRequest(query, variables);
      return data.questions;
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw error;
    }
  };
export const createQuestionAPI = async (quizId, content) => {
  const query = `
    mutation CreateQuestion($quizId: ID!, $content: String!) {
      createQuestion(quizId: $quizId, content: $content) {
        id
        content
        quiz {
          id
          title
        }
           options {
          id
          content
          isCorrect
        }
      }
    }
  `;

  const variables = { quizId, content };
  try {
    const data = await graphqlRequest(query, variables, true); 
    return data.createQuestion;
  } catch (error) {
    console.error("Error in createQuestionAPI:", error);
    throw error;
  }
};


export const deleteQuestionAPI = async (id) => {
  const query = `
    mutation DeleteQuestion($id: ID!) {
      deleteQuestion(id: $id) {
        message
      }
    }
  `;

  const variables = { id: parseInt(id, 10) };

  console.log("Delete Question Variables:", variables);
  try {
    const data = await graphqlRequest(query, variables, true);
    return data.deleteQuestion; 
  } catch (error) {
    console.error("Error in deleteQuestionAPI:", error);
    throw error;
  }
};

// Edit Question
export const editQuestionAPI = async (id, content) => {
  const query = `
    mutation EditQuestion($id: ID!, $content: String!) {
      editQuestion(id: $id, content: $content) {
        id
        content
      }
      
    }
  `;

  const variables = { id, content };
  try {
    const data = await graphqlRequest(query, variables, true);
    return data.editQuestion;
  } catch (error) {
    console.error("Error in editQuestionAPI:", error);
    throw error;
  }
};
