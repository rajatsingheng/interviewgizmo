
export const jobRoles = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "UX Designer",
  "Marketing Manager",
  "Sales Representative",
  "Project Manager",
];

export const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Apple",
  "Meta",
  "Netflix",
  "Tesla",
  "Other"
];

export const generateQuestionsForRole = (role: string, company: string) => {
  const commonQuestions = [
    "Tell me about yourself and your background.",
    "Why do you want to work at our company?",
    "Where do you see yourself in 5 years?",
  ];

  const roleSpecificQuestions: Record<string, string[]> = {
    "Software Engineer": [
      "Can you explain a challenging technical problem you've solved recently?",
      "What's your experience with system design and scalability?",
      "How do you approach testing and debugging?",
      "Explain the concept of time and space complexity.",
      "What's your preferred programming language and why?",
    ],
    "Product Manager": [
      "How do you prioritize features in a product roadmap?",
      "Describe a time when you had to make a difficult product decision.",
      "How do you gather and incorporate user feedback?",
      "Walk me through your process for launching a new product.",
      "How do you measure product success?",
    ],
    "Data Scientist": [
      "Explain your approach to A/B testing.",
      "How do you handle missing or corrupt data?",
      "Describe a complex data analysis project you've worked on.",
      "What's your experience with machine learning models?",
      "How do you communicate technical findings to non-technical stakeholders?",
    ],
  };

  const companySpecificQuestions = company !== "Other" ? [
    `What interests you most about ${company}'s products or services?`,
    `How would you contribute to ${company}'s mission and values?`,
    `What recent ${company} announcement or product launch excited you?`,
  ] : [];

  return [
    ...commonQuestions,
    ...(roleSpecificQuestions[role] || []),
    ...companySpecificQuestions,
  ];
};

export const getIdealAnswer = (question: string) => {
  const answers: Record<string, string> = {
    "Tell me about yourself and your background.": 
      "I am a results-driven professional with X years of experience in [field]. I've developed expertise in [specific skills] through my work at [previous companies/projects]. I'm particularly passionate about [relevant interests] and have a proven track record of [specific achievements].",
    "Why do you want to work at our company?":
      "I'm impressed by your company's innovation in [specific area] and commitment to [company values]. Your recent [project/product] particularly caught my attention. I believe my skills in [relevant skills] align perfectly with your needs, and I'm excited about contributing to [specific company goals].",
    "Where do you see yourself in 5 years?":
      "I am looking to advance my career in [specific field] and contribute to [specific company goals]. I am excited about the opportunity to work with [specific team members] and learn from [specific mentors].",
  };
  return answers[question] || "The ideal answer would demonstrate deep understanding of the topic, provide specific examples from experience, and show alignment with industry best practices.";
};

export const generateFeedback = (rating: number, question: string) => {
  if (rating >= 8) {
    return "Excellent response! You demonstrated strong knowledge and provided relevant examples. Consider adding more specific metrics or outcomes to strengthen your answer further.";
  } else if (rating >= 6) {
    return "Good answer, but there's room for improvement. Try to include more specific examples and structure your response using the STAR method (Situation, Task, Action, Result).";
  } else {
    return "Your answer needs significant improvement. Focus on understanding the core concepts, prepare specific examples from your experience, and practice articulating your thoughts clearly.";
  }
};

