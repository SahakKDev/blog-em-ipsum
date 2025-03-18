import { useQuery } from '@tanstack/react-query';
import './PostDetail.css';
import { fetchComments } from './api';

export function PostDetail({ post, deleteMutation, updateTitleMutatuion }) {
  const {
    data: comments,
    isLoading: isLoadingComment,

    isError,
    error,
  } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: fetchComments.bind(null, post.id),
    staleTime: 5000,
  });

  if (isError) {
    return (
      <>
        <h3>Error</h3>
        <p>{error.toString()}</p>
      </>
    );
  }

  return (
    <>
      <h3 style={{ color: 'blue' }}>{post.title}</h3>
      <div>
        <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
        {deleteMutation.isPending && (
          <p className="loading">Deleting the post</p>
        )}
        {deleteMutation.isError && (
          <p className="error">
            Error deleting the post: {deleteMutation.error.toString()}
          </p>
        )}
        {deleteMutation.isSuccess && (
          <p className="success">Post was (not) deleted.</p>
        )}
      </div>
      <div>
        <button
          onClick={() => {
            updateTitleMutatuion.mutate(post.id);
          }}
        >
          Update title
        </button>
        {updateTitleMutatuion.isPending && (
          <p className="loading">Title is updating...</p>
        )}
        {updateTitleMutatuion.isError && (
          <p className="error">{updateTitleMutatuion.error.toString()}</p>
        )}
        {updateTitleMutatuion.isSuccess && (
          <p className="success">Post title was (not) updated</p>
        )}
      </div>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {isLoadingComment && <div>Loading comments...</div>}
      {comments?.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
