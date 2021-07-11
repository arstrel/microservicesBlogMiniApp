import React from 'react';

export default function CommentList({ comments }) {
  const getCommentText = (comment = {}) => {
    switch (comment.status) {
      case 'pending':
        return 'This comment is awaiting moderation';
      case 'approved':
        return comment.content;
      case 'rejected':
        return 'This comment has been rejected';
      default:
        return 'Something went wrong';
    }
  };

  return (
    <ul>
      {comments.map((comment) => {
        const text = getCommentText(comment);
        return <li key={comment.id}>{text}</li>;
      })}
    </ul>
  );
}
