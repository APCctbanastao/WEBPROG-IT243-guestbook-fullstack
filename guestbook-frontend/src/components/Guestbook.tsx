import React, { useEffect, useState } from 'react';

interface GuestbookPost {
  id: string;
  name: string;
  message: string;
}

const API_URL = 'https://fluffy-space-halibut-r4v77xjprqw54-3002.app.github.dev/guestbook';

export const Guestbook = () => {
  const [posts, setPosts] = useState<GuestbookPost[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState('');

  const fetchPosts = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setPosts(data);
  };

  const addPost = async () => {
    if (!name || !message) return;
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message }),
    });
    setName('');
    setMessage('');
    fetchPosts();
  };

  const deletePost = async (id: string) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchPosts();
  };

  const startEditing = (post: GuestbookPost) => {
    setEditingId(post.id);
    setEditingMessage(post.message);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await fetch(`${API_URL}/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: editingMessage }),
    });
    setEditingId(null);
    setEditingMessage('');
    fetchPosts();
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <div>
      <h2>Guestbook</h2>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={addPost}>Add</button>

      <ul>
        {posts.map(p => (
          <li key={p.id}>
            <strong>{p.name}:</strong>{' '}
            {editingId === p.id ? (
              <>
                <input
                  value={editingMessage}
                  onChange={e => setEditingMessage(e.target.value)}
                />
                <button onClick={saveEdit}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {p.message}{' '}
                <button onClick={() => startEditing(p)}>Edit</button>
                <button onClick={() => deletePost(p.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
