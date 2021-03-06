import React, { useEffect, useState } from 'react';

import CommentCreate from './CommentCreate';
import CommentList from './CommentList';
import axios from 'axios';

export default function PostList() {
  const [posts, setPosts] = useState({});

  const fetchPosts = async () => {
    const res = await axios.get('http://posts.com/posts');
    /*
      { d0a88eee: { id: 'd0a88eee', title: 'second', comments: [ {id: 'asdf', content: 'test'} ] }
    */
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderedPosts = Object.values(posts).map((post) => {
    return (
      <div
        key={post.id}
        className="card"
        style={{ width: '30%', marginBottom: '20px' }}
      >
        <div className="card-body">
          <h3>{post.title}</h3>
          <hr />
          <CommentList comments={post.comments} />
          <CommentCreate postId={post.id} />
        </div>
      </div>
    );
  });

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {renderedPosts}
    </div>
  );
}
