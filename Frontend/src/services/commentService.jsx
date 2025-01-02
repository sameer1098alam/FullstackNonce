const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/posts`;

export const getComments = async (postId) => {
  const response = await fetch(`${API_URL}/${postId}/comments`);
  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }
  return response.json();
};

export const addComment = async (postId, commentData) => {
  const response = await fetch(`${API_URL}/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commentData),
  });
  if (!response.ok) {
    throw new Error('Failed to add comment');
  }
  return response.json();
};
