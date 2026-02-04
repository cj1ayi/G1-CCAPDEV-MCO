import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CommentCard, CommentCardProps } from "@/components/comment";
import { Moon, Sun } from "lucide-react";
import { getPostById, getCommentsByPostId } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const [voteState, setVoteState] = useState<"up" | "down" | null>(null);
  const [votes, setVotes] = useState<Record<string, "up" | "down" | null>>({});

  const post = id ? getPostById(id) : null;
  const comments = id ? getCommentsByPostId(id) : [];

  if (!post) {
    return (
      <div
        className={cn(
          "min-h-screen bg-background-light dark:bg-background-dark",
          "flex items-center justify-center"
        )}
      >
        <div className="text-center">
          <h1
            className={cn(
              "text-2xl font-bold text-gray-900 dark:text-white mb-4"
            )}
          >
            Post not found
          </h1>
          <button
            onClick={() => navigate("/test-posts")}
            className={cn(
              "bg-primary text-white px-6 py-2 rounded-lg",
              "hover:bg-primary-dark transition-colors"
            )}
          >
            Back to Posts
          </button>
        </div>
      </div>
    );
  }

  let displayUpvotes = post.upvotes;
  let displayDownvotes = post.downvotes;

  if (voteState === "up") {
    displayUpvotes += 1;
  } else if (voteState === "down") {
    displayDownvotes += 1;
  }

  const togglePostVote = (type: "up" | "down") => {
    setVoteState((prev) => (prev === type ? null : type));
  };

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  const toggleCommentVote = (commentId: string, voteType: "up" | "down") => {
    setVotes((prev) => ({
      ...prev,
      [commentId]: prev[commentId] === voteType ? null : voteType,
    }));
  };

  const getScore = (comment: CommentCardProps) => {
    const voteState = votes[comment.id];
    let score = comment.upvotes - comment.downvotes;

    if (voteState === "up") score += 1;
    if (voteState === "down") score -= 1;

    return score;
  };

  const sortCommentsByScore = (
    comments: CommentCardProps[]
  ): CommentCardProps[] => {
    const sorted = [...comments];
    return sorted.sort((a, b) => getScore(b) - getScore(a));
  };

  const addHandlers = (comment: CommentCardProps): CommentCardProps => {
    const voteStateForComment = votes[comment.id] || null;

    let displayUpvotes = comment.upvotes;
    let displayDownvotes = comment.downvotes;

    if (voteStateForComment === "up") displayUpvotes += 1;
    else if (voteStateForComment === "down") displayDownvotes += 1;

    return {
      ...comment,
      upvotes: displayUpvotes,
      downvotes: displayDownvotes,
      isUpvoted: voteStateForComment === "up",
      isDownvoted: voteStateForComment === "down",
      onUpvote: () => toggleCommentVote(comment.id, "up"),
      onDownvote: () => toggleCommentVote(comment.id, "down"),
      replies: comment.replies?.map(addHandlers),
    };
  };

  // Helper to count all nested comments
  const getTotalCommentCount = (list: CommentCardProps[]): number => {
    return list.reduce((acc, comment) => {
      const replyCount = comment.replies
        ? getTotalCommentCount(comment.replies)
        : 0;
      return acc + 1 + replyCount;
    }, 0);
  };

  const sortedComments = sortCommentsByScore(comments).map(addHandlers);
  const totalCommentCount = getTotalCommentCount(comments);

  return (
    <div
      className={cn(
        "min-h-screen bg-background-light",
        "dark:bg-background-dark"
      )}
    >
      {/* Navbar */}
      <header
        className={cn(
          "sticky top-0 z-50 flex items-center",
          "justify-between whitespace-nowrap",
          "border-b border-gray-200 dark:border-gray-800",
          "bg-surface-light dark:bg-surface-dark px-6 py-3",
          "shadow-sm"
        )}
      >
        <div className="flex items-center gap-8">
          <div
            onClick={() => navigate("/test-posts")}
            className={cn(
              "flex items-center gap-3 text-primary",
              "cursor-pointer hover:opacity-80",
              "transition-opacity"
            )}
          >
            <div
              className={cn(
                "size-8 bg-primary rounded-lg flex items-center",
                "justify-center text-white"
              )}
            >
              <span className="material-symbols-outlined text-[20px]">
                school
              </span>
            </div>

            <h2
              className={cn(
                "text-slate-900 dark:text-white text-xl",
                "font-bold tracking-tight"
              )}
            >
              AnimoForums
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className={cn(
              "flex items-center justify-center size-10",
              "rounded-full hover:bg-gray-100",
              "dark:hover:bg-gray-800 transition-colors",
              "text-slate-600 dark:text-slate-300"
            )}
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => navigate("/test-posts")}
            className={cn(
              "text-sm font-medium text-gray-600",
              "dark:text-gray-300 hover:text-primary",
              "transition-colors"
            )}
          >
            ← Back to Posts
          </button>
        </div>
      </header>

      <div className="flex justify-center w-full">
        <div className="w-full max-w-[900px] px-4 py-6">
          <main className="flex flex-col gap-4">
            {/* Breadcrumbs */}
            <div
              className={cn(
                "flex items-center gap-2 text-sm",
                "text-gray-500 dark:text-gray-400 mb-1"
              )}
            >
              <button
                onClick={() => navigate("/test-posts")}
                className="hover:text-primary transition-colors"
              >
                Test Posts
              </button>
              <span className="material-symbols-outlined text-[12px]">
                chevron_right
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {post.space}
              </span>
              <span className="material-symbols-outlined text-[12px]">
                chevron_right
              </span>
              <span className="truncate max-w-[300px]">{post.title}</span>
            </div>

            {/* Main Post Card */}
            <article
              className={cn(
                "bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft",
                "border border-gray-100 dark:border-gray-800 overflow-hidden"
              )}
            >
              <div className="flex">
                {/* Vote Widget (Left Side) */}
                <div
                  className={cn(
                    "hidden sm:flex flex-col items-center",
                    "gap-1 p-3 bg-gray-50/50 dark:bg-gray-800/20",
                    "border-r border-gray-100 dark:border-gray-800",
                    "w-14 shrink-0"
                  )}
                >
                  <button
                    onClick={() => togglePostVote("up")}
                    className={cn(
                      "p-1 rounded transition-colors",
                      voteState === "up"
                        ? "text-[#FF6B35] bg-orange-50 dark:bg-orange-900/20"
                        : "text-gray-400 hover:text-[#FF6B35] " +
                            "hover:bg-gray-200 dark:hover:bg-gray-700"
                    )}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={
                        voteState === "up"
                          ? { fontVariationSettings: "'FILL' 1" }
                          : undefined
                      }
                    >
                      arrow_upward
                    </span>
                  </button>
                  <span
                    className={cn(
                      "font-bold text-slate-700",
                      "dark:text-slate-300 text-sm"
                    )}
                  >
                    {displayUpvotes}
                  </span>
                  <button
                    onClick={() => togglePostVote("down")}
                    className={cn(
                      "p-1 rounded transition-colors",
                      voteState === "down"
                        ? "text-[#4A90E2] bg-blue-50 dark:bg-blue-900/20"
                        : "text-gray-400 hover:text-[#4A90E2] " +
                            "hover:bg-gray-200 dark:hover:bg-gray-700"
                    )}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={
                        voteState === "down"
                          ? { fontVariationSettings: "'FILL' 1" }
                          : undefined
                      }
                    >
                      arrow_downward
                    </span>
                  </button>
                </div>

                {/* Post Content */}
                <div className="flex-1 p-5 sm:p-6">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      alt="Author avatar"
                      className={cn(
                        "size-10 rounded-full border",
                        "border-gray-200 dark:border-gray-700"
                      )}
                      src={post.author.avatar as string}
                    />
                    <div className="flex flex-col text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "font-semibold text-slate-900",
                            "dark:text-white"
                          )}
                        >
                          u/{post.author.username}
                        </span>
                        {post.isOwner && (
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-bold",
                              "bg-green-100 text-green-700",
                              "dark:bg-green-900/30 dark:text-green-400"
                            )}
                          >
                            OP
                          </span>
                        )}
                      </div>
                      <div
                        className={cn(
                          "text-gray-500 dark:text-gray-400",
                          "flex items-center gap-1"
                        )}
                      >
                        <span>{post.createdAt}</span>
                        <span>•</span>
                        <span
                          className={cn(
                            "text-primary font-medium",
                            "hover:underline cursor-pointer"
                          )}
                        >
                          r/{post.space}
                        </span>
                        {post.isEdited && (
                          <>
                            <span>•</span>
                            <span className="text-xs italic">edited</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h1
                    className={cn(
                      "text-xl sm:text-2xl font-bold",
                      "text-slate-900 dark:text-white",
                      "mb-4 leading-tight"
                    )}
                  >
                    {post.title}
                  </h1>

                  {/* Body */}
                  <div
                    className={cn(
                      "text-slate-700 dark:text-slate-300",
                      "text-base leading-relaxed mb-4"
                    )}
                  >
                    {post.content}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-6">
                    {post.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className={cn(
                          "px-3 py-1 rounded-full",
                          "bg-gray-100 dark:bg-gray-800",
                          "text-xs font-medium text-gray-600",
                          "dark:text-gray-300 border",
                          "border-gray-200 dark:border-gray-700"
                        )}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Mobile Vote */}
                  <div
                    className={cn(
                      "flex sm:hidden items-center gap-4 mt-6 pt-4",
                      "border-t border-gray-100 dark:border-gray-800"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-1",
                        "bg-gray-100 dark:bg-gray-800 rounded-lg p-1"
                      )}
                    >
                      <button
                        onClick={() => togglePostVote("up")}
                        className="p-1 text-gray-500"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          arrow_upward
                        </span>
                      </button>
                      <span className="font-bold text-sm mx-1">
                        {displayUpvotes}
                      </span>
                      <button
                        onClick={() => togglePostVote("down")}
                        className="p-1 text-gray-500"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          arrow_downward
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Desktop Actions */}
                  <div
                    className={cn(
                      "hidden sm:flex items-center gap-6 mt-6 pt-4",
                      "border-t border-gray-100 dark:border-gray-800",
                      "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="material-symbols-outlined text-[20px]">
                        chat_bubble
                      </span>
                      <span>{totalCommentCount} Comments</span>
                    </div>
                    <button
                      className={cn(
                        "flex items-center gap-2",
                        "hover:bg-gray-100 dark:hover:bg-gray-800",
                        "px-2 py-1.5 rounded transition-colors",
                        "text-sm font-medium"
                      )}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        share
                      </span>
                      <span>Share</span>
                    </button>
                    <button
                      className={cn(
                        "flex items-center gap-2",
                        "hover:bg-gray-100 dark:hover:bg-gray-800",
                        "px-2 py-1.5 rounded transition-colors",
                        "text-sm font-medium"
                      )}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        bookmark
                      </span>
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Comment Input Area */}
            <div
              className={cn(
                "bg-surface-light dark:bg-surface-dark",
                "rounded-xl shadow-soft",
                "border border-gray-100 dark:border-gray-800",
                "p-4 sm:p-6"
              )}
            >
              <p className="text-sm text-gray-500 mb-2">
                Comment as{" "}
                <span className="font-medium text-primary">Current User</span>
              </p>
              <div
                className={cn(
                  "border border-gray-300 dark:border-gray-700",
                  "rounded-lg overflow-hidden",
                  "focus-within:ring-2 focus-within:ring-primary/50",
                  "focus-within:border-primary transition-all"
                )}
              >
                <div
                  className={cn(
                    "bg-gray-50 dark:bg-gray-800",
                    "border-b border-gray-300 dark:border-gray-700",
                    "px-3 py-2 flex items-center gap-2",
                    "text-gray-600 dark:text-gray-400"
                  )}
                >
                  <button
                    className={cn(
                      "hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded"
                    )}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      format_bold
                    </span>
                  </button>
                  <button
                    className={cn(
                      "hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded"
                    )}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      format_italic
                    </span>
                  </button>
                  <button
                    className={cn(
                      "hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded"
                    )}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      link
                    </span>
                  </button>
                  <button
                    className={cn(
                      "hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded"
                    )}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      code
                    </span>
                  </button>
                </div>
                <textarea
                  className={cn(
                    "w-full bg-transparent border-none p-4 min-h-[120px]",
                    "focus:ring-0 text-slate-800 dark:text-slate-200 resize-y"
                  )}
                  placeholder="What are your thoughts?"
                ></textarea>
              </div>
              <div className="flex justify-end mt-3">
                <button
                  className={cn(
                    "bg-primary hover:bg-primary-dark text-white",
                    "px-5 py-2 rounded-lg font-medium text-sm",
                    "transition-colors shadow-sm"
                  )}
                >
                  Post Comment
                </button>
              </div>
            </div>

            {/* Comment Section */}
            {comments.length > 0 && (
              <>
                <div className="flex items-center justify-between px-2 mt-4">
                  <h3 className="font-bold text-slate-800 dark:text-white">
                    Comments ({totalCommentCount})
                  </h3>
                  <div
                    className={cn(
                      "text-xs text-gray-500 uppercase",
                      "tracking-wide font-semibold"
                    )}
                  >
                    Sorted by Best
                  </div>
                </div>

                <div className="space-y-6">
                  {sortedComments.map((comment) => (
                    <CommentCard key={comment.id} {...comment} />
                  ))}
                </div>
              </>
            )}

            <div className="py-8 text-center text-sm text-gray-400">
              <p>End of comments</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
