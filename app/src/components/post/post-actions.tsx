import { IPopulatedPost } from "@/backend/posts";

interface PostActionsProps {
  post: IPopulatedPost;
}

export default function PostActions({ post }: PostActionsProps) {
  return (
    <div className='flex gap-6 text-gray-500'>
      <button className='flex items-center gap-2 transition-colors hover:text-blue-500'>
        <span>💬</span>
        <span>{post.engagement.replies}</span>
      </button>
      <button className='flex items-center gap-2 transition-colors hover:text-green-500'>
        <span>🔄</span>
        <span>{post.engagement.redrops}</span>
      </button>
      <button className='flex items-center gap-2 transition-colors hover:text-red-500'>
        <span>❤️</span>
        <span>{post.engagement.likes}</span>
      </button>
    </div>
  );
}
