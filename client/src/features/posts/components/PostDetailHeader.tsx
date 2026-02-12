import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui';
import { PostDetailBreadcrumbs } from './PostDetailBreadcrumbs';

interface PostDetailHeaderProps {
  post: any; // Replace with your Post type
  onEdit: () => void;
  onDelete: () => void;
  onSpaceClick: () => void;
}

export function PostDetailHeader({ post, onEdit, onDelete, onSpaceClick }: PostDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <PostDetailBreadcrumbs
        space={post.space}
        title={post.title}
        backUrl="/"
        backLabel="Home"
        onSpaceClick={onSpaceClick}
      />

      {post.isOwner && (
        <Dropdown
          align="right"
          trigger={
            <button
              className={cn(
                'p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800',
                'text-gray-500 dark:text-gray-400 transition-colors'
              )}
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          }
        >
          <DropdownItem icon={<Edit className="h-4 w-4" />} onClick={onEdit}>
            Edit Post
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem
            icon={<Trash2 className="h-4 w-4" />}
            destructive
            onClick={onDelete}
          >
            Delete Post
          </DropdownItem>
        </Dropdown>
      )}
    </div>
  );
}
