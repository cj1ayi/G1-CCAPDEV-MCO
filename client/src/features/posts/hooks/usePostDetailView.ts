import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostDetail } from './usePostDetail';
import { useComments  } from '@/features/comments/hooks/useComments';
import { useCommentVoting  } from '@/features/comments/hooks/useCommentVoting';
import { getTotalCommentCount } from '@/features/comments/utils/comment-utils';

export function usePostDetailView(postId?: string) {
  const navigate = useNavigate();

  const postDetail = usePostDetail({ postId });

  const { votes: commentVotes, addVoteHandlers } = useCommentVoting();

  const {
    comments: rawComments,
    isLoading: isLoadingComments,
    error: commentError,
    addComment,
    editComment,
    deleteComment,
  } = useComments({
    postId: postId || '',
    voteState: commentVotes,
  });

  const commentsWithHandlers = useMemo(() => {
    return rawComments.map((comment) =>
      addVoteHandlers(comment, editComment, deleteComment, addComment)
    );
  }, [rawComments, addVoteHandlers, editComment, deleteComment, addComment]);

  const totalCommentCount = useMemo(() => 
    getTotalCommentCount(commentsWithHandlers), 
    [commentsWithHandlers]
  );

  return {
    post: postDetail.post,
    isLoading: postDetail.isLoading,
    
    postActions: {
      score: postDetail.score,
      isUpvoted: postDetail.isUpvoted,
      isDownvoted: postDetail.isDownvoted,
      onUpvote: postDetail.onUpvote,
      onDownvote: postDetail.onDownvote,
      handleEdit: postDetail.handleEdit,
      handleDelete: postDetail.handleDelete,
      handleSpaceClick: postDetail.handleSpaceClick,
      openDeleteModal: postDetail.openDeleteModal,
      closeDeleteModal: postDetail.closeDeleteModal,
      isDeleteModalOpen: postDetail.isDeleteModalOpen,
    },

    comments: {
      data: commentsWithHandlers,
      count: totalCommentCount,
      isLoading: isLoadingComments,
      error: commentError,
      addComment,
    },

    navigate,
  };
}
