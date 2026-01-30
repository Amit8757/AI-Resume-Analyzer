/**
 * Calculate ATS score based on resume content and job description
 */
export const calculateATSScore = (resumeText, jobDescription, resumeSections) => {
    let score = 0;
    const maxScore = 100;
    const suggestions = [];
    const keywordsMatched = [];

    // Extract keywords from job description
    const jdKeywords = extractJobKeywords(jobDescription);

    // 1. Keyword Matching (50 points) - Increased weight
    const keywordScore = matchKeywords(resumeText, jdKeywords, keywordsMatched);
    score += keywordScore;

    if (keywordScore < 35) {
        suggestions.push('⚠️ Add more relevant keywords from the job description to your resume');
        suggestions.push(`💡 Focus on these missing keywords: ${keywordsMatched.filter(k => !k.found).slice(0, 5).map(k => k.keyword).join(', ')}`);
    }

    // 2. Resume Structure (25 points)
    const structureScore = evaluateStructure(resumeSections);
    score += structureScore;

    if (!resumeSections.hasContactInfo) {
        suggestions.push('📧 Add clear contact information (email, phone, LinkedIn)');
    }
    if (!resumeSections.hasExperience) {
        suggestions.push('💼 Include a detailed work experience section');
    }
    if (!resumeSections.hasEducation) {
        suggestions.push('🎓 Add your educational background');
    }
    if (!resumeSections.hasSkills) {
        suggestions.push('⚡ Create a dedicated skills section');
    }
    if (!resumeSections.hasSummary) {
        suggestions.push('📝 Add a professional summary or objective statement');
    }

    // 3. Content Quality (25 points)
    const contentScore = evaluateContent(resumeText);
    score += contentScore;

    if (resumeText.length < 500) {
        suggestions.push('📄 Expand your resume with more detailed descriptions of your experience');
    }

    // Action verbs check
    const actionVerbs = ['developed', 'implemented', 'managed', 'led', 'created', 'designed',
        'improved', 'achieved', 'built', 'launched', 'optimized', 'delivered',
        'coordinated', 'executed', 'established', 'streamlined'];
    const hasActionVerbs = actionVerbs.some(verb => resumeText.toLowerCase().includes(verb));
    if (!hasActionVerbs) {
        suggestions.push('💪 Use strong action verbs to describe your accomplishments (e.g., developed, implemented, managed)');
    }

    // Quantifiable achievements
    const hasNumbers = /\d+%|\d+\+|increased|decreased|reduced|improved by|\$\d+|saved \d+/i.test(resumeText);
    if (!hasNumbers) {
        suggestions.push('📊 Include quantifiable achievements (e.g., "Increased sales by 25%", "Managed team of 10")');
    }

    // Check for common ATS-friendly formatting
    const hasProperFormatting = checkFormatting(resumeText);
    if (!hasProperFormatting.hasBulletPoints) {
        suggestions.push('• Use bullet points to organize your experience and achievements');
    }

    // Industry-specific keywords
    const industryKeywords = extractIndustryKeywords(jobDescription);
    const industryMatches = industryKeywords.filter(kw =>
        resumeText.toLowerCase().includes(kw.toLowerCase())
    );

    if (industryMatches.length < industryKeywords.length * 0.5) {
        suggestions.push(`🎯 Include more industry-specific terms: ${industryKeywords.slice(0, 3).join(', ')}`);
    }

    return {
        atsScore: Math.min(Math.round(score), maxScore),
        keywordsMatched,
        suggestions: suggestions.slice(0, 8), // Limit to top 8 suggestions
        breakdown: {
            keywordScore: Math.round(keywordScore),
            structureScore: Math.round(structureScore),
            contentScore: Math.round(contentScore)
        }
    };
};

/**
 * Extract keywords from job description
 */
const extractJobKeywords = (jobDescription) => {
    const keywords = new Set();
    const lowerJD = jobDescription.toLowerCase();

    // Comprehensive technical skills and tools
    const techTerms = [
        // Programming Languages
        'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'go', 'rust', 'typescript',

        // Frontend
        'react', 'angular', 'vue', 'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap', 'jquery',
        'next.js', 'nuxt', 'gatsby', 'webpack', 'vite',

        // Backend
        'node.js', 'express', 'django', 'flask', 'spring', 'asp.net', 'laravel', 'rails',
        'fastapi', 'nestjs',

        // Databases
        'mongodb', 'mysql', 'postgresql', 'sql', 'nosql', 'redis', 'elasticsearch', 'oracle',
        'dynamodb', 'cassandra', 'sqlite',

        // Cloud & DevOps
        'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'jenkins', 'ci/cd',
        'terraform', 'ansible', 'linux', 'nginx', 'apache',

        // Tools & Methodologies
        'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'agile', 'scrum', 'kanban',
        'rest api', 'graphql', 'microservices', 'serverless',

        // Data & AI
        'machine learning', 'ai', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy',
        'data analysis', 'data science', 'big data', 'spark', 'hadoop',

        // Testing
        'jest', 'mocha', 'pytest', 'junit', 'selenium', 'cypress', 'testing', 'tdd', 'unit testing',

        // Soft Skills
        'leadership', 'communication', 'problem solving', 'teamwork', 'collaboration',
        'project management', 'analytical', 'critical thinking'
    ];

    techTerms.forEach(term => {
        if (lowerJD.includes(term)) {
            keywords.add(term);
        }
    });

    // Extract words that appear multiple times (likely important)
    const words = jobDescription.match(/\b[a-z]{3,}\b/gi) || [];
    const wordFreq = {};
    words.forEach(word => {
        const lower = word.toLowerCase();
        // Skip common words
        const commonWords = ['the', 'and', 'for', 'with', 'this', 'that', 'will', 'have', 'from', 'they', 'been', 'were', 'their'];
        if (!commonWords.includes(lower)) {
            wordFreq[lower] = (wordFreq[lower] || 0) + 1;
        }
    });

    // Add frequently mentioned words (appears 2+ times)
    Object.entries(wordFreq).forEach(([word, freq]) => {
        if (freq >= 2 && word.length > 3) {
            keywords.add(word);
        }
    });

    return Array.from(keywords);
};

/**
 * Extract industry-specific keywords
 */
const extractIndustryKeywords = (jobDescription) => {
    const lowerJD = jobDescription.toLowerCase();
    const industryTerms = [];

    const industries = {
        tech: ['software', 'development', 'engineering', 'programming', 'coding', 'technical'],
        business: ['sales', 'marketing', 'business', 'strategy', 'revenue', 'growth'],
        data: ['analytics', 'data', 'insights', 'metrics', 'reporting', 'visualization'],
        design: ['design', 'ui', 'ux', 'user experience', 'interface', 'wireframe'],
        management: ['management', 'leadership', 'team', 'project', 'stakeholder']
    };

    Object.values(industries).forEach(terms => {
        terms.forEach(term => {
            if (lowerJD.includes(term)) {
                industryTerms.push(term);
            }
        });
    });

    return [...new Set(industryTerms)];
};

/**
 * Match keywords between resume and job description
 */
const matchKeywords = (resumeText, jdKeywords, keywordsMatched) => {
    const lowerResume = resumeText.toLowerCase();
    let matchCount = 0;
    let weightedScore = 0;

    jdKeywords.forEach(keyword => {
        const found = lowerResume.includes(keyword.toLowerCase());
        keywordsMatched.push({ keyword, found });

        if (found) {
            matchCount++;
            // Give more weight to technical keywords
            const isTechnical = keyword.length > 4 && !['leadership', 'communication', 'teamwork'].includes(keyword);
            weightedScore += isTechnical ? 1.2 : 1;
        }
    });

    // Calculate score out of 50 (increased from 40)
    if (jdKeywords.length === 0) return 25; // Default score if no job description

    const matchPercentage = weightedScore / jdKeywords.length;
    return Math.min(Math.round(matchPercentage * 50), 50);
};

/**
 * Evaluate resume structure
 */
const evaluateStructure = (sections) => {
    let score = 0;

    if (sections.hasContactInfo) score += 5;
    if (sections.hasExperience) score += 8;
    if (sections.hasEducation) score += 5;
    if (sections.hasSkills) score += 5;
    if (sections.hasSummary) score += 2;

    return score; // Max 25 points
};

/**
 * Evaluate content quality
 */
const evaluateContent = (resumeText) => {
    let score = 0;

    // Length check (adequate content)
    if (resumeText.length > 1000) score += 8;
    else if (resumeText.length > 500) score += 5;
    else if (resumeText.length > 300) score += 2;

    // Action verbs
    const actionVerbs = ['developed', 'implemented', 'managed', 'led', 'created', 'designed',
        'improved', 'achieved', 'built', 'launched', 'optimized', 'delivered'];
    const actionVerbCount = actionVerbs.filter(verb => resumeText.toLowerCase().includes(verb)).length;
    score += Math.min(actionVerbCount * 1.5, 10);

    // Quantifiable achievements
    const numberMatches = resumeText.match(/\d+%|\d+\+|\$\d+|increased by \d+|decreased by \d+/gi) || [];
    score += Math.min(numberMatches.length * 2, 7);

    return Math.min(score, 25); // Max 25 points
};

/**
 * Check for ATS-friendly formatting
 */
const checkFormatting = (resumeText) => {
    return {
        hasBulletPoints: /[•\-\*]/.test(resumeText),
        hasProperSpacing: resumeText.includes('\n'),
        hasCapitalization: /[A-Z]/.test(resumeText)
    };
};
