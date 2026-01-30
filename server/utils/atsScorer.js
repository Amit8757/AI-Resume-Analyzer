/**
 * Enhanced ATS Scorer with Job Gap Analysis
 * Calculates ATS score and provides detailed analysis
 */

/**
 * Calculate comprehensive ATS analysis
 */
export const calculateATSScore = (resumeText, jobDescription, resumeSections) => {
    const analysis = {
        atsScore: 0,
        skillsMatch: 'Missing',
        experienceLevel: 'Junior',
        keywordsStatus: 'Missing',
        matchedKeywords: [],
        missingKeywords: [],
        suggestions: [],
        interviewQuestions: [],
        feedback: ''
    };

    // Extract keywords from job description
    const jdKeywords = extractJobKeywords(jobDescription);

    // 1. Keyword Matching (40 points)
    const keywordScore = matchKeywords(resumeText, jdKeywords, analysis.matchedKeywords, analysis.missingKeywords);
    analysis.atsScore += keywordScore;

    // 2. Section Completeness (30 points)
    const sectionScore = checkSections(resumeSections, analysis.suggestions);
    analysis.atsScore += sectionScore;

    // 3. Experience Level Detection (15 points)
    const experienceScore = detectExperience(resumeText, analysis);
    analysis.atsScore += experienceScore;

    // 4. Skills Match Analysis (15 points)
    const skillsScore = analyzeSkills(resumeText, jobDescription, analysis);
    analysis.atsScore += skillsScore;

    // Generate feedback message
    analysis.feedback = generateFeedback(analysis);

    // Generate interview questions
    analysis.interviewQuestions = generateInterviewQuestions(analysis.matchedKeywords, analysis.experienceLevel);

    // Determine overall status
    analysis.keywordsStatus = analysis.matchedKeywords.length > analysis.missingKeywords.length ? 'Match' : 'Missing';

    return analysis;
};

/**
 * Extract important keywords from job description
 */
const extractJobKeywords = (jobDescription) => {
    const jd = jobDescription.toLowerCase();
    const keywords = new Set();

    // Technical skills
    const technicalSkills = [
        'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node.js', 'express',
        'mongodb', 'sql', 'postgresql', 'mysql', 'aws', 'azure', 'gcp', 'docker', 'kubernetes',
        'git', 'ci/cd', 'agile', 'scrum', 'rest api', 'graphql', 'microservices',
        'typescript', 'html', 'css', 'sass', 'webpack', 'redux', 'next.js', 'tailwind',
        'spring boot', 'django', 'flask', 'laravel', 'php', 'ruby', 'rails',
        'c++', 'c#', '.net', 'go', 'rust', 'swift', 'kotlin', 'flutter', 'react native',
        'tensorflow', 'pytorch', 'machine learning', 'deep learning', 'ai', 'data science',
        'cloud architecture', 'devops', 'jenkins', 'terraform', 'ansible',
        'elasticsearch', 'redis', 'kafka', 'rabbitmq', 'nginx', 'apache'
    ];

    technicalSkills.forEach(skill => {
        if (jd.includes(skill)) {
            keywords.add(skill);
        }
    });

    // Soft skills
    const softSkills = [
        'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
        'project management', 'collaboration', 'mentoring', 'strategic thinking'
    ];

    softSkills.forEach(skill => {
        if (jd.includes(skill)) {
            keywords.add(skill);
        }
    });

    // Extract years of experience
    const yearsMatch = jd.match(/(\d+)\+?\s*years?/i);
    if (yearsMatch) {
        keywords.add(`${yearsMatch[1]}+ years experience`);
    }

    return Array.from(keywords);
};

/**
 * Match keywords between resume and job description
 */
const matchKeywords = (resumeText, jdKeywords, matchedKeywords, missingKeywords) => {
    const resume = resumeText.toLowerCase();
    let score = 0;
    const maxScore = 40;

    jdKeywords.forEach(keyword => {
        if (resume.includes(keyword.toLowerCase())) {
            matchedKeywords.push(keyword);
            score += maxScore / jdKeywords.length;
        } else {
            missingKeywords.push(keyword);
        }
    });

    return Math.min(score, maxScore);
};

/**
 * Check resume sections completeness
 */
const checkSections = (sections, suggestions) => {
    let score = 0;
    const maxScore = 30;
    const requiredSections = ['experience', 'education', 'skills'];
    const optionalSections = ['summary', 'projects', 'certifications'];

    // Required sections (20 points)
    requiredSections.forEach(section => {
        if (sections[section]) {
            score += 20 / requiredSections.length;
        } else {
            suggestions.push(`Add ${section} section to improve ATS score`);
        }
    });

    // Optional sections (10 points)
    optionalSections.forEach(section => {
        if (sections[section]) {
            score += 10 / optionalSections.length;
        }
    });

    return Math.min(score, maxScore);
};

/**
 * Detect experience level from resume
 */
const detectExperience = (resumeText, analysis) => {
    const text = resumeText.toLowerCase();
    let score = 15;

    // Look for years of experience
    const yearsMatch = text.match(/(\d+)\+?\s*years?/i);
    if (yearsMatch) {
        const years = parseInt(yearsMatch[1]);
        if (years >= 5) {
            analysis.experienceLevel = 'Senior';
            score = 15;
        } else if (years >= 2) {
            analysis.experienceLevel = 'Mid';
            score = 12;
        } else {
            analysis.experienceLevel = 'Junior';
            score = 10;
        }
    }

    // Look for senior keywords
    const seniorKeywords = ['senior', 'lead', 'principal', 'architect', 'manager', 'director'];
    const hasSeniorKeywords = seniorKeywords.some(keyword => text.includes(keyword));

    if (hasSeniorKeywords && analysis.experienceLevel !== 'Senior') {
        analysis.experienceLevel = 'Senior';
        score = 15;
    }

    return score;
};

/**
 * Analyze skills match
 */
const analyzeSkills = (resumeText, jobDescription, analysis) => {
    const resume = resumeText.toLowerCase();
    const jd = jobDescription.toLowerCase();
    let score = 0;
    const maxScore = 15;

    // Extract skills from both
    const resumeSkills = extractSkills(resume);
    const jobSkills = extractSkills(jd);

    if (jobSkills.length === 0) {
        analysis.skillsMatch = 'Match';
        return maxScore;
    }

    const matchedCount = jobSkills.filter(skill => resumeSkills.includes(skill)).length;
    const matchPercentage = (matchedCount / jobSkills.length) * 100;

    if (matchPercentage >= 75) {
        analysis.skillsMatch = 'Match';
        score = maxScore;
    } else if (matchPercentage >= 50) {
        analysis.skillsMatch = 'Partial';
        score = maxScore * 0.7;
        analysis.suggestions.push('Add more relevant skills from the job description');
    } else {
        analysis.skillsMatch = 'Missing';
        score = maxScore * 0.4;
        analysis.suggestions.push('Your skills do not closely match the job requirements');
    }

    return score;
};

/**
 * Extract skills from text
 */
const extractSkills = (text) => {
    const skills = new Set();
    const skillKeywords = [
        'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node.js',
        'mongodb', 'sql', 'aws', 'docker', 'kubernetes', 'git', 'agile',
        'typescript', 'html', 'css', 'redux', 'next.js', 'express',
        'leadership', 'communication', 'problem solving', 'teamwork'
    ];

    skillKeywords.forEach(skill => {
        if (text.includes(skill)) {
            skills.add(skill);
        }
    });

    return Array.from(skills);
};

/**
 * Generate feedback message
 */
const generateFeedback = (analysis) => {
    if (analysis.atsScore >= 80) {
        if (analysis.missingKeywords.length > 0) {
            const keyword = analysis.missingKeywords[0];
            return `Strong, but missing '${keyword}' keyword`;
        }
        return 'Excellent match! Your resume aligns well with the job requirements';
    } else if (analysis.atsScore >= 60) {
        return `Good match, but consider adding: ${analysis.missingKeywords.slice(0, 2).join(', ')}`;
    } else {
        return 'Needs improvement. Add more relevant keywords and skills';
    }
};

/**
 * Generate interview questions based on skills
 */
const generateInterviewQuestions = (matchedKeywords, experienceLevel) => {
    const questions = [];

    // Technical questions based on matched skills
    if (matchedKeywords.includes('react') || matchedKeywords.includes('javascript')) {
        questions.push('Explain the virtual DOM and how React uses it for performance optimization');
        questions.push('What are React hooks and when would you use them?');
    }

    if (matchedKeywords.includes('node.js')) {
        questions.push('How does Node.js handle asynchronous operations?');
    }

    if (matchedKeywords.includes('aws') || matchedKeywords.includes('cloud architecture')) {
        questions.push('Describe your experience with cloud infrastructure and deployment');
    }

    // Experience-based questions
    if (experienceLevel === 'Senior') {
        questions.push('Describe a time when you led a team through a challenging project');
        questions.push('How do you approach system design and architecture decisions?');
    } else if (experienceLevel === 'Mid') {
        questions.push('Tell me about a complex problem you solved recently');
        questions.push('How do you stay updated with new technologies?');
    } else {
        questions.push('What interests you most about this role?');
        questions.push('Describe a project you\'re proud of and your role in it');
    }

    // Leadership questions
    if (matchedKeywords.includes('leadership') || matchedKeywords.includes('management')) {
        questions.push('How do you handle conflicts within your team?');
    }

    return questions.slice(0, 5); // Return top 5 questions
};
