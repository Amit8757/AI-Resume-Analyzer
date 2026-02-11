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
    return ATS_OPTIMIZATION_PROMPT.format(
        resume_text=resume_text,
        job_description=job_description
    )
