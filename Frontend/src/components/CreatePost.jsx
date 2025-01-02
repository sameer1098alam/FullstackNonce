import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';
const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchPosts();
    }
  }, [navigate]);

  // Fetch all posts from the backend
  const fetchPosts = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setPosts(result.data);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error('Error while fetching posts:', error);
      setMessage(error.message);
    }
  };

  // Handle create or update post
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const url = editingPost
        ? `${import.meta.env.VITE_BACKEND_URL}/api/posts/${editingPost._id}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/posts`;
      const method = editingPost ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error(editingPost ? 'Failed to update post' : 'Failed to create post');
      }

      const newPost = await response.json();

      if (editingPost) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post._id === editingPost._id ? newPost : post))
        );
        setMessage('Post updated successfully!');
      } else {
        setPosts((prevPosts) => [...prevPosts, newPost]);
        setMessage('Post created successfully!');
      }

      setTitle('');
      setContent('');
      setEditingPost(null);
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Handle deleting a post
  const handleDelete = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setMessage('Post deleted successfully!');
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Handle liking a post
  const handleLike = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to like post');
      }

      const updatedPost = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Handle disliking a post
  const handleDislike = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${postId}/dislike`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to dislike post');
      }

      const updatedPost = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Handle adding a comment
  const handleAddComment = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentText }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const updatedPost = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
      setCommentText('');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{editingPost ? 'Edit Post' : 'Create Post'}</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          {editingPost ? 'Update' : 'Submit'}
        </button>
      </form>
      {message && <p>{message}</p>}

      <h2>Posts</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post._id}
            style={{
              border: '1px solid #ccc',
              margin: '10px 0',
              padding: '10px',
              borderRadius: '5px',
            }}
          >
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <div style={{ marginBottom: '10px' }}>
              <button
                onClick={() => handleLike(post._id)}
                style={{ marginRight: '10px' }}
              >
                Like ({post.likes || 0})
              </button>
              <button
                onClick={() => handleDislike(post._id)}
                style={{ marginRight: '10px' }}
              >
                Dislike ({post.dislikes || 0})
              </button>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment"
                style={{ width: '80%', marginRight: '10px' }}
              />
              <button onClick={() => handleAddComment(post._id)}>Comment</button>
            </div>
            <div>
              <strong>Comments:</strong>
              {post.comments && post.comments.length > 0 ? (
                <ul>
                  {post.comments.map((comment, index) => (
                    <li key={index}>{comment.content}</li>
                  ))}
                </ul>
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
            <button
              onClick={() => setEditingPost(post)}
              style={{ marginRight: '10px' }}
            >
              Edit
            </button>
            <button onClick={() => handleDelete(post._id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default CreatePost;
