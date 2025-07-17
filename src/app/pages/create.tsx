import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Create() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  const handleSubmit = async () => {
    await supabase.from('posts').insert({
      title,
      content,
      is_public: isPublic,
      is_premium: isPremium,
    });
    alert('Post created!');
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <input type="text" placeholder="Title" onChange={e => setTitle(e.target.value)} />
      <textarea placeholder="Content" onChange={e => setContent(e.target.value)} />
      <label><input type="checkbox" checked={isPublic} onChange={() => setIsPublic(!isPublic)} /> Public</label>
      <label><input type="checkbox" checked={isPremium} onChange={() => setIsPremium(!isPremium)} /> Premium</label>
      <button type="submit">Publish</button>
    </form>
  );
}

