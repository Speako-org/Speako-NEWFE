import { useState } from 'react';

interface Post {
  id: number;
  userName: string;
  badge: string;
  timeAgo: string;
  content: string;
  before: string;
  after: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

interface Comment {
  id: number;
  userName: string;
  content: string;
  timeAgo: string;
}

export const useSocial = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'friends'>('feed');
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      userName: '박은지',
      content: '정말 멋진 변화네요! 저도 도움이 많이 되었어요 👍',
      timeAgo: '2시간 전',
    },
    {
      id: 2,
      userName: '박은지',
      content: '긍정적인 마인드가 정말 중요하죠! 응원합니다 💪',
      timeAgo: '1시간 전',
    },
    {
      id: 3,
      userName: '박은지',
      content: '저도 비슷한 경험이 있어서 공감이 많이 가요!',
      timeAgo: '30분 전',
    },
  ]);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      userName: '박은지',
      badge: '긍정 마스터',
      timeAgo: '1시간 전',
      content:
        "오늘 발표할 때 긴장했지만, '할 수 있다'는 긍정적인 마인드로 임했더니 잘 해낼 수 있었어요!",
      before: '너무 긴장되고 못할 것 같아요',
      after: '긴장되지만 잘 할 수 있어요',
      likes: 35,
      comments: 5,
      isLiked: false,
    },
    {
      id: 2,
      userName: '박은지',
      badge: '긍정 마스터',
      timeAgo: '1시간 전',
      content: '일주일 동안 부정적인 표현을 긍정적으로 바꾸기 위해 노력했어요. 변화가 보이네요!',
      before: '이번에도 실패할 것 같아요',
      after: '노력하면 성공할 수 있어요',
      likes: 28,
      comments: 3,
      isLiked: false,
    },
    {
      id: 3,
      userName: '박은지',
      badge: '성장 중',
      timeAgo: '2시간 전',
      content: '오늘 면접에서 긴장했지만, 긍정적인 마인드로 임했더니 좋은 결과를 얻을 수 있었어요!',
      before: '면접에서 떨어질 것 같아요',
      after: '최선을 다하면 좋은 결과가 있을 거예요',
      likes: 42,
      comments: 7,
      isLiked: false,
    },
    {
      id: 4,
      userName: '박은지',
      badge: '긍정 마스터',
      timeAgo: '3시간 전',
      content: '매일 아침 긍정적인 문장을 외우면서 하루를 시작하니 기분이 훨씬 좋아졌어요!',
      before: '오늘도 힘들 것 같아요',
      after: '오늘도 좋은 하루가 될 거예요',
      likes: 56,
      comments: 12,
      isLiked: false,
    },
    {
      id: 5,
      userName: '박은지',
      badge: '성장 중',
      timeAgo: '4시간 전',
      content:
        '부정적인 생각이 들 때마다 긍정적으로 바꿔보려고 노력하고 있어요. 점점 쉬워지고 있어요!',
      before: '이런 일은 항상 나에게만 일어나요',
      after: '이런 경험을 통해 더 성장할 수 있어요',
      likes: 31,
      comments: 4,
      isLiked: false,
    },
  ]);

  const handleLikeToggle = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleCommentPress = (postId: number) => {
    setCommentModalVisible(true);
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: comments.length + 1,
        userName: '나',
        content: commentText.trim(),
        timeAgo: '방금 전',
      };
      setComments((prev) => [...prev, newComment]);
      setCommentText('');
    }
  };

  return {
    activeTab,
    setActiveTab,
    commentModalVisible,
    setCommentModalVisible,
    commentText,
    setCommentText,
    comments,
    posts,
    handleLikeToggle,
    handleCommentPress,
    handleAddComment,
  };
};
