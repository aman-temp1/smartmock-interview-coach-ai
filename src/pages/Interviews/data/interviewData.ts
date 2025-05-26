
export const interviewTypes = [
  { id: "general", name: "General Interview" },
  { id: "technical", name: "Technical Interview" },
  { id: "behavioral", name: "Behavioral Interview" },
  { id: "case-study", name: "Case Study Interview" },
  { id: "leadership", name: "Leadership Interview" },
];

export const experienceLevels = [
  { id: "entry", name: "Entry Level (0-2 years)" },
  { id: "mid", name: "Mid Level (3-5 years)" },
  { id: "senior", name: "Senior Level (6-10 years)" },
  { id: "lead", name: "Lead/Principal (10+ years)" },
  { id: "executive", name: "Executive/C-Level" },
];

export const interviewers = [
  {
    id: "sarah",
    name: "Sarah Chen",
    gender: "female",
    voiceId: "kore",
    description: "Professional HR manager with 8+ years experience. Known for structured, empathetic interviews."
  },
  {
    id: "michael",
    name: "Michael Rodriguez",
    gender: "male",
    voiceId: "charon",
    description: "Senior technical lead specializing in system design and architecture. Direct but encouraging style."
  },
  {
    id: "alex",
    name: "Alex Thompson",
    gender: "neutral",
    voiceId: "zephyr",
    description: "Product manager with startup experience. Focuses on problem-solving and innovation."
  },
  {
    id: "priya",
    name: "Priya Patel",
    gender: "female",
    voiceId: "zubenelgenubi",
    description: "Executive coach and former CEO. Emphasizes leadership potential and strategic thinking."
  }
];

export const getInterviewPrompt = (
  interviewType: string,
  position: string,
  experienceLevel: string,
  companyName?: string,
  companyDescription?: string,
  jobDescription?: string,
  interviewer?: any
) => {
  const interviewerName = interviewer?.name || "AI Interviewer";
  const interviewerBackground = interviewer?.description || "experienced interviewer";
  
  const basePrompt = `You are ${interviewerName}, an ${interviewerBackground}. 

You are conducting a ${interviewType} interview for a ${position} position${companyName ? ` at ${companyName}` : ''}. The candidate has ${experienceLevel} experience level.

${companyDescription ? `Company Background: ${companyDescription}` : ''}
${jobDescription ? `Job Description: ${jobDescription}` : ''}

INTERVIEW STRUCTURE:
1. Start with a warm introduction and brief overview of the interview process
2. Ask the candidate to introduce themselves
3. Proceed with relevant questions based on the interview type
4. Allow time for candidate questions at the end

INTERVIEW GUIDELINES:
- Be professional, friendly, and encouraging
- Ask follow-up questions to dive deeper into responses
- Provide constructive feedback when appropriate
- Keep questions relevant to the position and experience level
- Make the candidate feel comfortable while maintaining professionalism

QUESTION TYPES FOR ${interviewType.toUpperCase()} INTERVIEW:`;

  const typeSpecificPrompts = {
    general: `
- Background and experience questions
- Motivation and career goals
- Strengths and areas for improvement
- Cultural fit and values alignment
- Scenario-based questions relevant to the role`,

    technical: `
- Technical knowledge and problem-solving skills
- System design and architecture (for senior roles)
- Coding challenges and algorithms
- Technology stack experience
- Best practices and code quality`,

    behavioral: `
- STAR method based questions (Situation, Task, Action, Result)
- Leadership and teamwork examples
- Conflict resolution and communication
- Adaptability and learning experiences
- Ethics and decision-making scenarios`,

    "case-study": `
- Business problem analysis
- Strategic thinking and frameworks
- Data interpretation and insights
- Recommendation development
- Presentation and communication of solutions`,

    leadership: `
- Team management and development
- Strategic vision and planning
- Change management and innovation
- Stakeholder management
- Executive decision-making and accountability`
  };

  return basePrompt + (typeSpecificPrompts[interviewType as keyof typeof typeSpecificPrompts] || typeSpecificPrompts.general) + 
    `\n\nStart the interview now by introducing yourself and asking the candidate to introduce themselves.`;
};
