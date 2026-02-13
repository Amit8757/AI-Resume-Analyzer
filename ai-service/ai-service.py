"""
AI Resume Optimization Microservice
Flask server that uses Google Gemini API or Hugging Face API to rewrite resumes
in an ATS-friendly format.

Architecture:
    Client (React) -> Node.js Server -> Python Flask Service -> AI API (Gemini/HuggingFace)
"""

import os
import traceback
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
from openai import OpenAI
from prompts import build_ats_prompt, build_interview_prompt

# Load environment variables
load_dotenv()

# Configure AI providers
AI_PROVIDER = os.getenv("AI_PROVIDER", "ollama").lower()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")

if AI_PROVIDER == "gemini":
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
        print("WARNING: GEMINI_API_KEY is not set. Get a free key at https://aistudio.google.com/apikey")
    else:
        genai.configure(api_key=GEMINI_API_KEY)
elif AI_PROVIDER == "huggingface":
    if not HUGGINGFACE_API_KEY or HUGGINGFACE_API_KEY == "your_huggingface_token_here":
        print("WARNING: HUGGINGFACE_API_KEY is not set. Get a free token at https://huggingface.co/settings/tokens")
elif AI_PROVIDER == "openai":
    if not OPENAI_API_KEY or OPENAI_API_KEY.startswith("your_"):
        print("WARNING: OPENAI_API_KEY is not set. Get a key at https://platform.openai.com/api-keys")
    else:
        openai_client = OpenAI(api_key=OPENAI_API_KEY)
elif AI_PROVIDER == "ollama":
    print(f"Using Ollama at {OLLAMA_BASE_URL} with model {OLLAMA_MODEL}")

# AI API Key (for internal service authentication)
AI_SERVICE_API_KEY = os.getenv("AI_SERVICE_API_KEY")

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from Node.js server

# Decorator to check for API key
def require_api_key(f):
    def decorated_function(*args, **kwargs):
        if not AI_SERVICE_API_KEY:
            # If not configured, allow (optional, for dev)
            return f(*args, **kwargs)
        
        request_key = request.headers.get("X-API-Key")
        if request_key != AI_SERVICE_API_KEY:
            return jsonify({
                "success": False,
                "error": "Unauthorized: Invalid API key"
            }), 401
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

# ─── AI Model Configuration ─────────────────────────────────────────────────
def get_gemini_model():
    """
    Initialize and return the Gemini generative model.
    Uses gemini-1.5-flash for generous free tier limits.
    """
    return genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config={
            "temperature": 0.3,       # Lower = more deterministic/professional
            "top_p": 0.9,
            "max_output_tokens": 4096
        }
    )


def call_huggingface_api(prompt):
    """
    Call Hugging Face Inference API with an open-source LLM.
    Uses the new OpenAI-compatible router endpoint.
    """
    API_URL = "https://router.huggingface.co/v1/chat/completions"
    headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
    
    payload = {
        "model": "mistralai/Mistral-7B-Instruct-v0.2",
        "messages": [
            {"role": "system", "content": "You are an expert resume writer specializing in ATS optimization."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 4096,
        "temperature": 0.3,
        "top_p": 0.9
    }
    
    response = requests.post(API_URL, headers=headers, json=payload, timeout=120)
    
    if response.status_code != 200:
        raise Exception(f"Hugging Face API error: {response.status_code} - {response.text}")
    
    result = response.json()
    
    # OpenAI-compatible response format
    if "choices" in result and len(result["choices"]) > 0:
        return result["choices"][0].get("message", {}).get("content", "").strip()
    else:
        raise Exception(f"Unexpected Hugging Face response format: {result}")


def call_openai_api(prompt):
    """
    Call OpenAI API with GPT-4.
    Uses gpt-4o-mini for cost-effective, high-quality results.
    """
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",  # Cost-effective GPT-4 variant
        messages=[
            {"role": "system", "content": "You are an expert resume writer specializing in ATS optimization."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=4096
    )
    
    return response.choices[0].message.content.strip()


def call_ollama_api(prompt):
    """
    Call Ollama API running locally.
    Uses llama3.2 or any other model you have installed.
    """
    response = requests.post(
        f"{OLLAMA_BASE_URL}/api/generate",
        json={
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.3,
                "num_predict": 4096
            }
        },
        timeout=300  # 5 minutes for local inference
    )
    
    if response.status_code != 200:
        raise Exception(f"Ollama API error: {response.status_code} - {response.text}")
    
    result = response.json()
    return result.get("response", "").strip()




# ─── Routes ───────────────────────────────────────────────────────────────────

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint for monitoring."""
    return jsonify({
        "status": "healthy",
        "service": "AI Resume Optimizer",
        "ai_provider": AI_PROVIDER,
        "gemini_configured": bool(GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here"),
        "huggingface_configured": bool(HUGGINGFACE_API_KEY and HUGGINGFACE_API_KEY != "your_huggingface_token_here"),
        "openai_configured": bool(OPENAI_API_KEY and not OPENAI_API_KEY.startswith("your_")),
        "ollama_url": OLLAMA_BASE_URL if AI_PROVIDER == "ollama" else None
    }), 200


@app.route("/optimize", methods=["POST"])
@require_api_key
def optimize_resume():
    """
    Optimize a resume for ATS compatibility using Google Gemini AI.

    Request Body:
        resumeText (str): Extracted text from the resume PDF
        jobDescription (str): Target job description

    Returns:
        JSON with optimizedResume (str): ATS-optimized resume text
    """
    try:
        # Validate API key based on provider
        if AI_PROVIDER == "gemini":
            if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
                return jsonify({
                    "success": False,
                    "error": "Gemini API key not configured. Set GEMINI_API_KEY in ai-service/.env"
                }), 500
        elif AI_PROVIDER == "huggingface":
            if not HUGGINGFACE_API_KEY or HUGGINGFACE_API_KEY == "your_huggingface_token_here":
                return jsonify({
                    "success": False,
                    "error": "Hugging Face API key not configured. Set HUGGINGFACE_API_KEY in ai-service/.env"
                }), 500
        elif AI_PROVIDER == "openai":
            if not OPENAI_API_KEY or OPENAI_API_KEY.startswith("your_"):
                return jsonify({
                    "success": False,
                    "error": "OpenAI API key not configured. Set OPENAI_API_KEY in ai-service/.env"
                }), 500
        # Ollama doesn't need API key validation

        # Parse request body
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "error": "Request body is required"
            }), 400

        resume_text = data.get("resumeText", "").strip()
        job_description = data.get("jobDescription", "").strip()

        if not resume_text:
            return jsonify({
                "success": False,
                "error": "Resume text is required"
            }), 400

        if not job_description:
            return jsonify({
                "success": False,
                "error": "Job description is required"
            }), 400

        # Build the prompt
        prompt = build_ats_prompt(resume_text, job_description)

        # Call AI API based on provider
        if AI_PROVIDER == "gemini":
            model = get_gemini_model()
            response = model.generate_content(prompt)
            optimized_resume = response.text.strip()
        elif AI_PROVIDER == "huggingface":
            optimized_resume = call_huggingface_api(prompt)
        elif AI_PROVIDER == "openai":
            optimized_resume = call_openai_api(prompt)
        elif AI_PROVIDER == "ollama":
            optimized_resume = call_ollama_api(prompt)
        else:
            return jsonify({
                "success": False,
                "error": f"Unknown AI provider: {AI_PROVIDER}. Use 'gemini', 'huggingface', 'openai', or 'ollama'"
            }), 500

        return jsonify({
            "success": True,
            "optimizedResume": optimized_resume
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": f"AI optimization failed: {str(e)}"
        }), 500


@app.route("/generate-questions", methods=["POST"])
@require_api_key
def generate_questions():
    """
    Generate interview questions based on resume and job role.

    Request Body:
        resumeText (str): Extracted text from the resume
        jobRole (str): Target job role

    Returns:
        JSON with questions (list): List of generated interview questions
    """
    try:
        # Validate API key based on provider
        if AI_PROVIDER == "gemini":
            if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
                return jsonify({"success": False, "error": "Gemini API key not configured"}), 500
        elif AI_PROVIDER == "huggingface":
            if not HUGGINGFACE_API_KEY or HUGGINGFACE_API_KEY == "your_huggingface_token_here":
                return jsonify({"success": False, "error": "Hugging Face API key not configured"}), 500
        elif AI_PROVIDER == "openai":
            if not OPENAI_API_KEY or OPENAI_API_KEY.startswith("your_"):
                return jsonify({
                    "success": False,
                    "error": "OpenAI API key not configured. Set OPENAI_API_KEY in ai-service/.env"
                }), 500
        # Ollama doesn't need API key validation

        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Request body is required"}), 400

        resume_text = data.get("resumeText", "").strip()
        job_role = data.get("jobRole", "Software Engineer").strip()

        if not resume_text:
            return jsonify({"success": False, "error": "Resume text is required"}), 400

        # Build prompt
        print(f"Generating interview questions for job role: {job_role}")
        prompt = build_interview_prompt(resume_text, job_role)

        # Call AI API
        if AI_PROVIDER == "gemini":
            model = get_gemini_model()
            response = model.generate_content(prompt)
            output = response.text.strip()
        elif AI_PROVIDER == "huggingface":
            output = call_huggingface_api(prompt)
        elif AI_PROVIDER == "openai":
            output = call_openai_api(prompt)
        elif AI_PROVIDER == "ollama":
            output = call_ollama_api(prompt)
        else:
            return jsonify({"success": False, "error": f"Unknown AI provider: {AI_PROVIDER}"}), 500

        # Parse questions from output (expects bullet points)
        questions = [q.strip().replace('•', '').strip() for q in output.split('\n') if q.strip().startswith('•') or q.strip().startswith('-') or (q.strip() and q.strip()[0].isdigit() and '.' in q.strip()[:3])]
        
        # Fallback if parsing fails - just take all non-empty lines
        if not questions:
            questions = [line.strip() for line in output.split('\n') if line.strip() and len(line) > 10]

        return jsonify({
            "success": True,
            "questions": questions[:7] # Stick to 5-7 questions
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": f"Failed to generate questions: {str(e)}"
        }), 500


# ─── Server Startup ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    print(f"AI Resume Optimizer Service starting on port {port}")
    print(f"AI Provider: {AI_PROVIDER.upper()}")
    if AI_PROVIDER == "gemini":
        print(f"Gemini API configured: {bool(GEMINI_API_KEY and GEMINI_API_KEY != 'your_gemini_api_key_here')}")
    elif AI_PROVIDER == "huggingface":
        print(f"Hugging Face API configured: {bool(HUGGINGFACE_API_KEY and HUGGINGFACE_API_KEY != 'your_huggingface_token_here')}")
    elif AI_PROVIDER == "openai":
        print(f"OpenAI API configured: {bool(OPENAI_API_KEY and not OPENAI_API_KEY.startswith('your_'))}")
    elif AI_PROVIDER == "ollama":
        print(f"Ollama URL: {OLLAMA_BASE_URL}")
        print(f"Ollama Model: {OLLAMA_MODEL}")
    app.run(host="0.0.0.0", port=port, debug=True)
