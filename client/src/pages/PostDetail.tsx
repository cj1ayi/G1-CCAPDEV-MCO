import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePostDetailView } from '@/features/posts/hooks/usePostDetailView';
import { Card, Button } from '@/components/ui';
import { SidebarNav } from '@/features/navigation/components/SidebarNav';
import { 
  PostDetailHeader, 
  PostDetailContent, 
  DeletePostModal 
} from '@/features/posts/components';
import { 
  CommentInput, 
  CommentSection 
} from '@/features/comments/components';
import { 
  YourSpacesWidget 
} from '@/features/spaces/components/YourSpacesWidget';

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
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!post) {
    return (
      <MainLayout>
        <Card className="text-center py-20 px-6">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <p className="text-muted-foreground mb-6">
            This post has been removed or doesn't exist.
          </p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </Card>
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
          isUpvoted={postActions.isUpvoted}
          isDownvoted={postActions.isDownvoted}
          onUpvote={postActions.onUpvote}
          onDownvote={postActions.onDownvote}
        />

        <div className="mt-4">
          <CommentInput onSubmit={comments.addComment} />
        </div>

        {comments.isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : comments.error ? (
          <Card className={cn(
            "p-4 bg-destructive/10 border-destructive/20",
            "text-destructive text-center text-sm"
            )}
          >
            {comments.error.message}
          </Card>
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
