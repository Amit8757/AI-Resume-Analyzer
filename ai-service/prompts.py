"""
ATS Resume Optimization Prompt Templates
Provides structured prompts for Google Gemini API to rewrite resumes
in an ATS-friendly format.
"""


ATS_OPTIMIZATION_PROMPT = """
You are an ATS Resume Optimization Expert.

Your task:
1. Rewrite the provided resume to be 100% ATS-friendly.
2. Use a single-column layout.
3. START with the candidate's name and contact info at the very top (Email | Phone | Location | GitHub | LinkedIn).
4. Use a clear section-based structure with markdown headers (e.g., # SECTION NAME):
   - # PROFESSIONAL SUMMARY
   - # TECHNICAL SKILLS
   - # WORK EXPERIENCE
   - # PROJECTS
   - # EDUCATION
5. For sections with bullet points (Experience, Projects), use a clear bullet symbol (•).
6. Naturally include missing job description keywords ONLY if they align with the candidate's experience.
7. Do NOT invent skills or experience.
8. Structure Work Experience as: **Job Title**, Company Name | Date Range.
9. CRITICAL: Do NOT use horizontal lines (---), emojis, or special icons. Use only standard text and # for headers.
10. Output should be clean, professional, and use clear headings so it can be perfectly formatted into a PDF.

Input:
Resume:
{resume_text}

Job Description:
{job_description}

Output:
Return only the rewritten ATS-friendly resume text.
"""


def build_ats_prompt(resume_text: str, job_description: str) -> str:
    """
    Build the ATS optimization prompt by injecting resume text
    and job description into the template.

    Args:
        resume_text: Extracted text from the user's resume PDF
        job_description: Target job description to optimize against

    Returns:
        Complete prompt string ready to send to Gemini API
    """
    return ATS_OPTIMIZATION_PROMPT.replace("{resume_text}", resume_text).replace("{job_description}", job_description)

INTERVIEW_QUESTION_PROMPT = """
You are an expert technical interviewer.

Your task:
1. Analyze the candidate's resume and the target job role.
2. Generate 5-7 high-quality, challenging interview questions that are specifically tailored to the candidate's experience, projects, and skills mentioned in their resume.
3. Questions should range from technical deep-dives to behavioral questions based on their past work.
4. If a specific job role is provided, ensure the questions align with the standard expectations for that role (e.g., Software Engineer, Data Scientist).
5. Output should be a clean list of questions, one per line, starting with a bullet point (•).

Input:
Resume:
{resume_text}

Job Role:
{job_role}

Output:
Return only the list of generated interview questions.
"""

def build_interview_prompt(resume_text: str, job_role: str) -> str:
    return INTERVIEW_QUESTION_PROMPT.replace("{resume_text}", resume_text).replace("{job_role}", job_role)
