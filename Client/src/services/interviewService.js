import api from './api';

/**
 * Create a new interview session
 */
export const createInterview = async (jobRole, difficulty = 'Medium', resumeId = null) => {
    const response = await api.post('/interviews', { jobRole, difficulty, resumeId });
    return response.data;
};

/**
 * Get all user interviews
 */
export const getInterviews = async () => {
    const response = await api.get('/interviews');
    return response.data;
};

/**
 * Get single interview
 */
export const getInterview = async (id) => {
    const response = await api.get(`/interviews/${id}`);
    return response.data;
};

/**
 * Submit answer to a question
 */
export const submitAnswer = async (id, questionIndex, answer) => {
    const response = await api.put(`/interviews/${id}/answer`, { questionIndex, answer });
    return response.data;
};

/**
 * Complete interview and get feedback
 */
export const completeInterview = async (id) => {
    const response = await api.post(`/interviews/${id}/complete`);
    return response.data;
};

/**
 * Delete interview
 */
export const deleteInterview = async (id) => {
    const response = await api.delete(`/interviews/${id}`);
    return response.data;
};
