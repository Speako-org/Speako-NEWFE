import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Main: undefined;
};

type SignupScreenProps = NativeStackScreenProps<RootStackParamList, 'Signup'>;

const Signup: React.FC<SignupScreenProps> = ({ navigation }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nickname: '',
    gender: '',
    birthDate: '',
    profileImage: null as string | null,
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderSelect = (gender: string) => {
    setFormData((prev) => ({
      ...prev,
      gender,
    }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData((prev) => ({
        ...prev,
        profileImage: result.assets[0].uri,
      }));
    }
  };

  const handleSignUp = async () => {
    try {
      navigation.replace('Login');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
          <View className="mt-12 flex-1 items-center justify-center">
            <Text className="mt-5 text-center text-[30px] font-bold text-[#A187FF]">회원가입</Text>
            <Text className="mb-8 text-base font-semibold leading-7 text-gray-600">
              계정을 생성하세요!
            </Text>

            <View className="mb-1 w-[98%]">
              <Text className="mb-1 mt-3 text-sm font-medium text-[#333]">아이디*</Text>
              <View className="mb-5 flex-row items-center border-b border-gray-300 py-1">
                <Ionicons name="person-outline" size={20} color="#666" className="mr-2" />
                <TextInput
                  className="h-[45px] flex-1 text-[#333]"
                  placeholder="아이디를 입력하세요"
                  value={formData.username}
                  onChangeText={(text) => handleInputChange('username', text)}
                />
              </View>

              <Text className="mb-1 mt-3 text-sm font-medium text-[#333]">비밀번호*</Text>
              <View className="mb-5 flex-row items-center border-b border-gray-300 py-1">
                <Ionicons name="lock-closed-outline" size={20} color="#666" className="mr-2" />
                <TextInput
                  className="h-[45px] flex-1 text-[#333]"
                  placeholder="비밀번호를 입력하세요"
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(text) => handleInputChange('password', text)}
                />
              </View>

              <Text className="mb-1 mt-3 text-sm font-medium text-[#333]">닉네임*</Text>
              <View className="mb-5 flex-row items-center border-b border-gray-300 py-1">
                <Ionicons name="person-circle-outline" size={20} color="#666" className="mr-2" />
                <TextInput
                  className="h-[45px] flex-1 text-[#333]"
                  placeholder="닉네임을 입력하세요"
                  value={formData.nickname}
                  onChangeText={(text) => handleInputChange('nickname', text)}
                />
                <TouchableOpacity onPress={pickImage}>
                  <Ionicons name="camera-outline" size={20} color="#999" className="mr-2" />
                </TouchableOpacity>
              </View>

              {formData.profileImage && (
                <Image
                  source={{ uri: formData.profileImage }}
                  className="mt-2 h-24 w-24 self-center rounded-full"
                />
              )}

              <Text className="mb-1 mt-3 text-sm font-medium text-[#333]">나이/성별 (선택)</Text>
              <View className="mb-5 flex-row justify-between">
                {['male', 'female', 'other'].map((g, idx) => (
                  <TouchableOpacity
                    key={idx}
                    className={`mx-1 flex-1 items-center rounded border px-3 py-2 ${
                      formData.gender === g ? 'border-[#8884FF]' : 'border-gray-300'
                    }`}
                    onPress={() => handleGenderSelect(g)}>
                    <Text className="text-gray-600">
                      {g === 'male' ? '남' : g === 'female' ? '여' : '선택 안함'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="mb-1 mt-3 text-sm font-medium text-[#333]">생년월일*</Text>
              <View className="mb-5 flex-row items-center border-b border-gray-300 py-1">
                <Ionicons name="calendar-outline" size={20} color="#666" className="mr-2" />
                <TextInput
                  className="h-[45px] flex-1 text-[#333]"
                  placeholder="YYYY-MM-DD"
                  value={formData.birthDate}
                  onChangeText={(text) => handleInputChange('birthDate', text)}
                />
              </View>
            </View>

            <View className="flex-row justify-between">
              <TouchableOpacity
                className="h-[30px] w-full overflow-hidden rounded-xl"
                onPress={handleSignUp}>
                <LinearGradient
                  colors={['#94A0FF', '#D2B6FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="flex-1 items-center justify-center rounded-xl">
                  <Text className="text-base font-semibold text-white">회원가입</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View className="flex-row">
              <Text className="mr-1 text-gray-500">계정이 있으신가요?</Text>
              <TouchableOpacity
                onPress={() =>
                  router.replace({
                    pathname: '/(public)/login',
                  })
                }>
                <Text className="text-sm font-semibold text-[#8884FF]">로그인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Signup;
