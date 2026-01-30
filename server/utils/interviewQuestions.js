/**
 * Question bank for different job roles
 */
const questionBank = {
    'Software Engineer': [
        'Tell me about a challenging bug you fixed and how you approached it.',
        'Explain the difference between REST and GraphQL APIs.',
        'How do you ensure code quality in your projects?',
        'Describe your experience with version control systems like Git.',
        'What is your approach to learning new technologies?',
        'Tell me about a time you optimized application performance.',
        'How do you handle technical debt in a project?',
        'Explain your understanding of design patterns.',
        'Describe a project where you worked in a team. What was your role?',
        'How do you stay updated with the latest technology trends?'
    ],
    'Data Scientist': [
        'Explain the difference between supervised and unsupervised learning.',
        'How do you handle missing data in a dataset?',
        'Describe a machine learning project you worked on.',
        'What is overfitting and how do you prevent it?',
        'Explain the bias-variance tradeoff.',
        'How do you evaluate the performance of a classification model?',
        'Tell me about your experience with data visualization.',
        'What is your approach to feature engineering?',
        'Describe a time when you had to explain complex data insights to non-technical stakeholders.',
        'How do you ensure the ethical use of data in your projects?'
    ],
    'Product Manager': [
        'How do you prioritize features in a product roadmap?',
        'Describe a time when you had to make a difficult product decision.',
        'How do you gather and incorporate user feedback?',
        'Explain your approach to defining product requirements.',
        'Tell me about a product launch you managed.',
        'How do you measure product success?',
        'Describe your experience working with cross-functional teams.',
        'How do you handle conflicting stakeholder requirements?',
        'What frameworks do you use for product strategy?',
        'Tell me about a time when a product feature failed. What did you learn?'
    ],
    'Designer': [
        'Walk me through your design process.',
        'How do you incorporate user feedback into your designs?',
        'Describe a challenging design problem you solved.',
        'How do you balance aesthetics with functionality?',
        'Tell me about your experience with user research.',
        'How do you handle design critiques?',
        'Describe a time when you had to advocate for a design decision.',
        'What design tools and software are you proficient in?',
        'How do you ensure accessibility in your designs?',
        'Tell me about a project where you collaborated with developers.'
    ],
    'Marketing': [
        'Describe a successful marketing campaign you led.',
        'How do you measure the ROI of marketing activities?',
        'Tell me about your experience with digital marketing channels.',
        'How do you identify and target your ideal customer?',
        'Describe your approach to content marketing.',
        'How do you stay updated with marketing trends?',
        'Tell me about a time when a campaign didn\'t perform as expected. What did you do?',
        'How do you use data to inform marketing decisions?',
        'Describe your experience with marketing automation tools.',
        'How do you collaborate with sales teams?'
    ],
    'Sales': [
        'Describe your sales process from lead to close.',
        'How do you handle objections from potential customers?',
        'Tell me about your biggest sales achievement.',
        'How do you build and maintain client relationships?',
        'Describe a time when you lost a deal. What did you learn?',
        'How do you stay motivated during slow periods?',
        'What CRM tools have you used?',
        'How do you qualify leads?',
        'Tell me about a time you exceeded your sales quota.',
        'How do you handle difficult customers?'
    ],
    'General': [
        'Tell me about yourself and your background.',
        'What are your greatest strengths?',
        'What is your biggest weakness?',
        'Why are you interested in this position?',
        'Where do you see yourself in 5 years?',
        'Describe a challenging situation you faced and how you handled it.',
        'How do you handle stress and pressure?',
        'What motivates you in your work?',
        'Tell me about a time you failed. What did you learn?',
        'Why should we hire you?'
    ]
};

/**
 * Get random questions for a job role
 */
export const getInterviewQuestions = (jobRole, count = 5) => {
    const questions = questionBank[jobRole] || questionBank['General'];

    // Shuffle and select random questions
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
};

/**
 * Generate feedback for interview responses
 */
export const generateInterviewFeedback = (questions) => {
    const answeredQuestions = questions.filter(q => q.answer && q.answer.trim() !== '');
    const totalQuestions = questions.length;
    const answeredCount = answeredQuestions.length;

    // Calculate completion percentage
    const completionRate = (answeredCount / totalQuestions) * 100;

    // Analyze answer quality
    let totalScore = 0;
    const strengths = [];
    const improvements = [];

    answeredQuestions.forEach(q => {
        const answerLength = q.answer.length;
        let questionScore = 0;

        // Length check
        if (answerLength > 200) {
            questionScore += 30;
        } else if (answerLength > 100) {
            questionScore += 20;
        } else if (answerLength > 50) {
            questionScore += 10;
        }

        // Check for specific examples (STAR method)
        const hasExample = /example|instance|time when|situation|experience/i.test(q.answer);
        if (hasExample) {
            questionScore += 20;
            strengths.push('Used specific examples in responses');
        }

        // Check for action verbs
        const actionVerbs = ['implemented', 'developed', 'managed', 'led', 'created', 'improved', 'achieved', 'solved'];
        const hasActionVerbs = actionVerbs.some(verb => q.answer.toLowerCase().includes(verb));
        if (hasActionVerbs) {
            questionScore += 20;
        }

        // Check for quantifiable results
        const hasNumbers = /\d+%|\d+ |increased|decreased|reduced|improved by/i.test(q.answer);
        if (hasNumbers) {
            questionScore += 15;
            strengths.push('Included quantifiable results');
        }

        // Check for structured response
        const hasBulletPoints = q.answer.includes('-') || q.answer.includes('•');
        if (hasBulletPoints || q.answer.split('.').length > 3) {
            questionScore += 15;
            strengths.push('Well-structured responses');
        }

        totalScore += Math.min(questionScore, 100);
    });

    // Calculate overall score
    const averageScore = answeredCount > 0 ? totalScore / answeredCount : 0;
    const overallScore = Math.round((averageScore * 0.7) + (completionRate * 0.3));

    // Generate improvement suggestions
    if (completionRate < 100) {
        improvements.push('Complete all interview questions for better practice');
    }

    const avgLength = answeredQuestions.reduce((sum, q) => sum + q.answer.length, 0) / answeredCount;
    if (avgLength < 100) {
        improvements.push('Provide more detailed answers (aim for 150-300 words per question)');
    }

    const hasExamplesCount = answeredQuestions.filter(q =>
        /example|instance|time when|situation|experience/i.test(q.answer)
    ).length;

    if (hasExamplesCount < answeredCount * 0.5) {
        improvements.push('Use the STAR method (Situation, Task, Action, Result) to structure your answers');
    }

    const hasNumbersCount = answeredQuestions.filter(q =>
        /\d+%|\d+ |increased|decreased|reduced|improved by/i.test(q.answer)
    ).length;

    if (hasNumbersCount < answeredCount * 0.3) {
        improvements.push('Include quantifiable achievements and metrics in your responses');
    }

    // Remove duplicates from strengths
    const uniqueStrengths = [...new Set(strengths)];

    // Generate detailed feedback
    let detailedFeedback = `You completed ${answeredCount} out of ${totalQuestions} questions (${Math.round(completionRate)}%). `;

    if (overallScore >= 80) {
        detailedFeedback += 'Excellent performance! Your responses were comprehensive and well-structured. ';
    } else if (overallScore >= 60) {
        detailedFeedback += 'Good effort! Your responses show promise, but there\'s room for improvement. ';
    } else {
        detailedFeedback += 'Keep practicing! Focus on providing more detailed and structured responses. ';
    }

    if (uniqueStrengths.length > 0) {
        detailedFeedback += `Your strengths include: ${uniqueStrengths.join(', ')}. `;
    }

    if (improvements.length > 0) {
        detailedFeedback += `Areas for improvement: ${improvements.join('; ')}.`;
    }

    return {
        overallScore,
        strengths: uniqueStrengths.slice(0, 3), // Top 3 strengths
        improvements: improvements.slice(0, 3), // Top 3 improvements
        detailedFeedback
    };
};
