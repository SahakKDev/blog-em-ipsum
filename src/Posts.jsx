import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { PostDetail } from './PostDetail';
import { fetchPosts, deletePost, updatePost } from './api';
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['posts', currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 2000,
  });
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
  });

  const updateTitleMutatuion = useMutation({
    mutationFn: (postId) => updatePost(postId),
  });

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;

      queryClient.prefetchQuery({
        queryKey: ['posts', nextPage],
        queryFn: () => fetchPosts(nextPage),
        staleTime: 2000,
      });
    }
  }, [queryClient, currentPage]);

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  if (isError) {
    return (
      <>
        <h3>Oops, something went wrong!</h3>
        <p>{error.toString()}</p>
      </>
    );
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => {
              deleteMutation.reset();
              updateTitleMutatuion.reset();
              setSelectedPost(post);
            }}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && (
        <PostDetail
          post={selectedPost}
          deleteMutation={deleteMutation}
          updateTitleMutatuion={updateTitleMutatuion}
        />
      )}
    </>
  );
}
