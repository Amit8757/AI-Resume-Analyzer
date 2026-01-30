import api from './api';

/**
 * Upload a resume
 */
export const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await api.post('/resumes/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

/**
 * Get all user resumes
 */
export const getResumes = async () => {
    const response = await api.get('/resumes');
    return response.data;
};

/**
 * Get single resume
 */
export const getResume = async (id) => {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
};

/**
 * Analyze resume against job description
 */
export const analyzeResume = async (id, jobDescription) => {
    const response = await api.put(`/resumes/${id}/analyze`, { jobDescription });
    return response.data;
};

/**
 * Delete resume
 */
export const deleteResume = async (id) => {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
};
