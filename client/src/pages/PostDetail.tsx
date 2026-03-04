import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { usePostDetailView } from '@/features/posts/hooks/usePostDetailView';
import { SidebarNav } from '@/features/navigation/components';
import { YourSpacesWidget } from '@/features/spaces/components';
import { ErrorState, PostDetailSkeleton, CommentsSkeleton } from '@/components/shared';

import { 
  PostDetailHeader, 
  PostDetailContent, 
  DeletePostModal 
} from '@/features/posts/components';

import { 
  CommentInput, 
  CommentSection 
} from '@/features/comments/components';


export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  
  const { 
    post, 
    isLoading, 
    postActions, 
    comments, 
    navigate 
  } = usePostDetailView(id);

  if (isLoading) {
    return (
      <MainLayout
        maxWidth="max-w-6xl"
        leftSidebar={
          <div className="space-y-6">
            <SidebarNav />
            <div className="h-px bg-gray-200 dark:bg-gray-800" />
            <YourSpacesWidget />
          </div>
        }
      >
        <PostDetailSkeleton />
        <CommentsSkeleton count={3} />
      </MainLayout>
    );
  }

  if (!post) {
    return (
      <MainLayout>
        <ErrorState
          title="Post not found"
          message="This post has been removed or does not exist"
          onRetry={() => navigate(-1)}
        />
     </MainLayout>
    );
  }

  return (
   <MainLayout
      maxWidth="max-w-6xl"
      leftSidebar={
        <div className="space-y-6">
          <SidebarNav />
          <div className="h-px bg-gray-200 dark:bg-gray-800" />
          <YourSpacesWidget />
        </div>
      }
    >
 
      <div className="flex flex-col gap-4">
        <PostDetailHeader 
          post={post}
          onEdit={postActions.handleEdit}
          onDelete={postActions.openDeleteModal}
          onSpaceClick={postActions.handleSpaceClick}
        />

        <PostDetailContent
          post={post}
          commentCount={comments.count}
          score={postActions.score}
          upvotes={postActions.upvotes}
          downvotes={postActions.downvotes}
          isUpvoted={postActions.isUpvoted}
          isDownvoted={postActions.isDownvoted}
          onUpvote={postActions.onUpvote}
          onDownvote={postActions.onDownvote}
        />

        <div className="mt-4">
          <CommentInput onSubmit={comments.addComment} />
        </div>

        {comments.isLoading ? (
          <CommentsSkeleton count={5} />
       ) : comments.error ? (
          <ErrorState
            title="Failed to load comments"
            message={comments.error.message}
          />
        ) : (
          <CommentSection
            comments={comments.data}
            totalCount={comments.count}
          />
        )}
      </div>

      <DeletePostModal
        isOpen={postActions.isDeleteModalOpen}
        postTitle={post.title}
        onConfirm={postActions.handleDelete}
        onClose={postActions.closeDeleteModal}
      />
    </MainLayout>
  );
}
