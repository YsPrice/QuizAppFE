const mockQuizzes = [
    {
      id: "1",
      title: "JavaScript Basics",
      status: "PUBLISHED",
      difficulty: "EASY",
      createdBy: "user1", // Simulates another user
    },
    {
      id: "2",
      title: "React Fundamentals",
      status: "DRAFT",
      difficulty: "MEDIUM",
      createdBy: "user2", // Simulates another user
    },
    {
      id: "3",
      title: "Node.js Advanced Topics",
      status: "PUBLISHED",
      difficulty: "HARD",
      createdBy: "currentUserId", // Simulates the logged-in user
    },
    {
      id: "4",
      title: "Express.js Essentials",
      status: "DRAFT",
      difficulty: "MEDIUM",
      createdBy: "currentUserId", // Simulates the logged-in user
    },
  ];
  
  export default mockQuizzes;
  