import graphqlRequest from './graphql'; 


export const createOptionAPI = async (questionId, isCorrect, content) => {
  const query = `
    mutation CreateOption($questionId: ID!, $isCorrect: Boolean!, $content: String!) {
      createOption(questionId: $questionId, isCorrect: $isCorrect, content: $content) {
        id
        content
        isCorrect
        question {
          id
        }
      }
    }
  `;

  const variables = { questionId, isCorrect, content };
  try {
    const data = await graphqlRequest(query, variables, true);
    return data.createOption;
  } catch (error) {
    console.error("Error in createOptionAPI:", error);
    throw error;
  }
};


export const deleteOptionAPI = async (questionId, optionId) => {
  const query = `
    mutation DeleteOption($questionId: ID!, $optionId: ID!) {
      deleteOption(questionId: $questionId, optionId: $optionId) {
        message
      }
    }
  `;

  const variables = { questionId, optionId };
  try {
    const data = await graphqlRequest(query, variables, true);
    return data.deleteOption; 
  } catch (error) {
    console.error("Error in deleteOptionAPI:", error);
    throw error;
  }
};

// Edit Option
export const editOptionAPI = async (questionId, optionId, isCorrect, content) => {
  const query = `
    mutation EditOption($questionId: ID!, $optionId: ID!, $isCorrect: Boolean, $content: String) {
      editOption(questionId: $questionId, optionId: $optionId, isCorrect: $isCorrect, content: $content) {
        id
        content
        isCorrect
      }
    }
  `;

  const variables = { questionId, optionId, isCorrect, content };
  try {
    const data = await graphqlRequest(query, variables, true);
    return data.editOption;
  } catch (error) {
    console.error("Error in editOptionAPI:", error);
    throw error;
  }
};


export const fetchOptionsAPI = async (questionId) => {
  const query = `
    query FetchOptions($questionId: ID!) {
      options(questionId: $questionId) {
        id
        content
        isCorrect
      }
    }
  `;

  const variables = { questionId };
  try {
    const data = await graphqlRequest(query, variables, true);
    return data.options;
  } catch (error) {
    console.error("Error in fetchOptionsAPI:", error);
    throw error;
  }
};
