import {
  Pressable,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSocial } from '../../../../hooks/useSocial';

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

export default function SocialScreen() {
  const {
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
  } = useSocial();

  const PostCard = ({ post }: { post: Post }) => (
    <View className="mx-4 mb-4 rounded-lg border border-gray-200 bg-white p-4">
      {/* 유저 정보 */}
      <View className="mb-4 flex-row items-center">
        <View className="mr-3 h-10 w-10 rounded-full bg-gray-300" />
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="mr-2 text-lg font-semibold">{post.userName}</Text>
            <View className="rounded-full bg-purple-100 px-2 py-1">
              <Text className="text-xs text-purple-600">{post.badge}</Text>
            </View>
          </View>
          <Text className="text-base text-gray-500">{post.timeAgo}</Text>
        </View>
      </View>

      {/* 내용 */}
      <Text className="mb-3 text-base leading-6">{post.content}</Text>

      {/* before/after */}
      <View className="mb-3 rounded-lg bg-gray-50 p-3">
        <View className="mb-1 flex-row items-center">
          <Text style={{ color: '#DF3A3A' }} className="mr-2 text-sm font-medium">
            Before:
          </Text>
          <Text style={{ color: '#ADADAD' }} className="text-sm line-through">
            {post.before}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text style={{ color: '#62C059' }} className="mr-2 text-sm font-medium">
            After:
          </Text>
          <Text style={{ color: '#000000' }} className="text-sm">
            {post.after}
          </Text>
        </View>
      </View>

      {/* before/after 이미지 자리 표시 */}
      <View className="mb-3 flex-row justify-center">
        <View className="mr-8 items-center">
          <Text style={{ color: '#DF3A3A' }} className="mb-1 text-base font-semibold">
            Before
          </Text>
          <View className="h-16 w-16 rounded-full border-2 border-gray-300" />
        </View>
        <View className="items-center">
          <Text style={{ color: '#62C059' }} className="mb-1 text-base font-semibold">
            After
          </Text>
          <View className="h-16 w-16 rounded-full border-2 border-gray-300" />
        </View>
      </View>

      {/* 좋아요, 댓글, 공유 */}
      <View className="flex-row items-center">
        <TouchableOpacity
          className="mr-4 flex-row items-center"
          onPress={() => handleLikeToggle(post.id)}>
          <Ionicons
            name={post.isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={post.isLiked ? '#EF4444' : '#6B7280'}
          />
          <Text className="ml-2 text-lg text-gray-600">{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mr-4 flex-row items-center"
          onPress={() => handleCommentPress(post.id)}>
          <Ionicons name="chatbubble-outline" size={24} color="#6B7280" />
          <Text className="ml-2 text-lg text-gray-600">{post.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="paper-plane-outline" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 헤더 */}
      <View className="px-6 pb-6 pt-12">
        <Text className="mb-6 text-3xl font-bold">소셜</Text>

        {/* 탭 */}
        <View className="flex-row rounded-xl bg-gray-100 p-1">
          <TouchableOpacity
            className={
              activeTab === 'feed'
                ? 'flex-1 rounded-lg bg-black px-4 py-2'
                : 'flex-1 rounded-lg px-4 py-2'
            }
            onPress={() => setActiveTab('feed')}>
            <Text
              className={
                activeTab === 'feed'
                  ? 'text-center text-lg font-medium text-white'
                  : 'text-center text-lg font-medium text-gray-500'
              }>
              피드
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={
              activeTab === 'friends'
                ? 'flex-1 rounded-lg bg-black px-4 py-2'
                : 'flex-1 rounded-lg px-4 py-2'
            }
            onPress={() => setActiveTab('friends')}>
            <Text
              className={
                activeTab === 'friends'
                  ? 'text-center text-lg font-medium text-white'
                  : 'text-center text-lg font-medium text-gray-500'
              }>
              친구
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 콘텐츠 */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}>
        {activeTab === 'feed' && posts.map((post) => <PostCard key={post.id} post={post} />)}
        {activeTab === 'friends' && (
          <View className="items-center justify-center py-20">
            <Text className="text-gray-500">준비 중</Text>
          </View>
        )}
      </ScrollView>

      {/* 댓글 모달 */}
      <Modal
        visible={commentModalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setCommentModalVisible(false)}>
        <Pressable
          className="flex-1 bg-black bg-opacity-50"
          onPress={() => setCommentModalVisible(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{ height: '80%' }}
            className="mt-auto rounded-t-3xl bg-white">
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}>
              <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
                <Text className="ml-4 text-lg font-semibold">댓글</Text>
                <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <ScrollView className="flex-1 p-4">
                {comments.map((comment) => (
                  <View key={comment.id} className="mb-4">
                    <View className="mb-2 flex-row items-start">
                      <View className="mr-3 mt-1 h-8 w-8 rounded-full bg-gray-300" />
                      <View className="flex-1">
                        <View className="mb-1 flex-row items-center">
                          <Text className="font-medium">{comment.userName}</Text>
                          <Text className="ml-2 text-sm text-gray-500">{comment.timeAgo}</Text>
                        </View>
                        <Text className="text-sm">{comment.content}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <View className="border-t border-gray-200 p-4">
                <View className="flex-row items-center">
                  <View
                    className={
                      commentText.trim()
                        ? 'mr-3 flex-1 rounded-full bg-gray-100 px-4 py-3'
                        : 'flex-1 rounded-full bg-gray-100 px-4 py-3'
                    }>
                    <TextInput
                      value={commentText}
                      onChangeText={setCommentText}
                      placeholder="댓글을 입력하세요..."
                      placeholderTextColor="#9CA3AF"
                      style={{
                        textAlignVertical: 'center',
                        fontSize: 16,
                        color: '#000000',
                        outline: 'none',
                      }}
                      multiline={false}
                      autoFocus={false}
                      onSubmitEditing={handleAddComment}
                      returnKeyType="send"
                    />
                  </View>
                  {commentText.trim() && (
                    <TouchableOpacity onPress={handleAddComment}>
                      <Ionicons name="send" size={20} color="#8953E0" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </KeyboardAvoidingView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
