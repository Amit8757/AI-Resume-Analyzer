import pdfParse from 'pdf-parse';
import fs from 'fs';

/**
 * Extract text from PDF resume
 */
export const extractTextFromPDF = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    } catch (error) {
        console.error('Error parsing PDF:', error);
        return '';
    }
};

/**
 * Extract keywords from text
 */
export const extractKeywords = (text) => {
    // Common resume sections and keywords
    const keywords = {
        skills: [],
        experience: [],
        education: []
    };

    const lowerText = text.toLowerCase();

    // Comprehensive technical skills
    const techSkills = [
        'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin',
        'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring',
        'mongodb', 'mysql', 'postgresql', 'sql', 'nosql', 'redis',
        'html', 'css', 'typescript', 'sass', 'tailwind', 'bootstrap',
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'jenkins',
        'agile', 'scrum', 'rest api', 'graphql', 'machine learning', 'ai',
        'tensorflow', 'pytorch', 'pandas', 'numpy'
    ];

    techSkills.forEach(skill => {
        if (lowerText.includes(skill)) {
            keywords.skills.push(skill);
        }
    });

    // Check for experience indicators
    const experiencePatterns = [
        /(\d+)\+?\s*years?\s*of\s*experience/gi,
        /worked\s+at/gi,
        /developed/gi,
        /implemented/gi,
        /managed/gi,
        /led\s+a\s+team/gi
    ];

    experiencePatterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
            keywords.experience.push(...matches);
        }
    });

    // Check for education
    const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college', 'b.s.', 'm.s.', 'b.a.', 'm.a.'];
    educationKeywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
            keywords.education.push(keyword);
        }
    });

    return keywords;
};

/**
 * Check if resume has standard sections (Enhanced)
 */
export const checkResumeSections = (text) => {
    const lowerText = text.toLowerCase();

    const sections = {
        hasContactInfo: /email|phone|linkedin|github|@|[\+\(]?\d{3}[\)\-]?\s?\d{3}[\-]?\d{4}/i.test(text),
        hasExperience: /experience|work history|employment|professional experience|work experience|career history/i.test(lowerText),
        hasEducation: /education|degree|university|college|academic|qualification|b\.s\.|m\.s\.|bachelor|master/i.test(lowerText),
        hasSkills: /skills|technologies|technical skills|competencies|expertise|proficiencies/i.test(lowerText),
        hasSummary: /summary|objective|about|profile|professional summary|career objective|overview/i.test(lowerText)
    };

    return sections;
};
