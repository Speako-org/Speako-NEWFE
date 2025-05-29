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
import MaskedView from '@react-native-masked-view/masked-view';
import GradientText from '../../components/GradientText';
type RootStackParamList = { Login: undefined; Signup: undefined; Main: undefined };
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
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleGenderSelect = (gender: string) => {
    setFormData((prev) => ({ ...prev, gender }));
  };
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setFormData((prev) => ({ ...prev, profileImage: result.assets[0].uri }));
    }
  };
  const handleSignUp = async () => {
    router.push({ pathname: '/(public)/login' });
  };
  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
          <View className="mt-12 flex-1 items-center justify-center">
            <GradientText text="회원가입" style="mt-5 text-center text-[30px] font-bold mb-1" />
            <Text className="mb-8 text-base font-semibold leading-7 text-gray-600">
              계정을 생성하세요!
            </Text>
            <View className="mb-1 w-[98%]">
              <Text className="mb-1 mt-3 text-sm font-medium text-[#333]">아이디*</Text>
              <View
                className="mb-5 flex-row items-center border-b py-1"
                style={{
                  borderBottomColor: '#D1D5DB',
                  borderBottomWidth: 1,
                }}>
                <Ionicons name="person-outline" size={20} color="#CECECE" className="mr-2" />
                <TextInput
                  className="h-[40px] flex-1 px-1 text-[#333]"
                  placeholder="아이디를 입력하세요"
                  placeholderTextColor="#CECECE"
                  value={formData.username}
                  onChangeText={(text) => handleInputChange('username', text)}
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              <Text className="mb-1 mt-3 text-sm font-medium text-[#333]">비밀번호*</Text>
              <View
                className="mb-5 flex-row items-center border-b py-1"
                style={{
                  borderBottomColor: '#D1D5DB',
                  borderBottomWidth: 1,
                }}>
                <Ionicons name="lock-closed-outline" size={20} color="#CECECE" className="mr-2" />
                <TextInput
                  className="h-[40px] flex-1 px-1 text-[#333]"
                  placeholder="비밀번호를 입력하세요"
                  placeholderTextColor="#CECECE"
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={(text) => handleInputChange('password', text)}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />
                <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                  <Ionicons
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color="#999"
                    className="mr-2"
                  />
                </TouchableOpacity>
              </View>
              <Text className="mb-1 mt-3 text-sm font-medium text-[#333]">닉네임*</Text>
              <View
                className="mb-5 flex-row items-center border-b py-1"
                style={{
                  borderBottomColor: '#D1D5DB',
                  borderBottomWidth: 1,
                }}>
                <Ionicons name="person-circle-outline" size={20} color="#CECECE" className="mr-2" />
                <TextInput
                  className="h-[40px] flex-1 px-1 text-[#333]"
                  placeholder="닉네임을 입력하세요"
                  placeholderTextColor="#CECECE"
                  value={formData.nickname}
                  onChangeText={(text) => handleInputChange('nickname', text)}
                  onFocus={() => setFocusedInput('nickname')}
                  onBlur={() => setFocusedInput(null)}
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
              <View className="mb-3 flex-row justify-between">
                {['male', 'female', 'other'].map((g, idx) => (
                  <TouchableOpacity
                    key={idx}
                    className={`mx-1 mt-2 flex-1 items-center rounded border px-2 py-2 ${formData.gender === g ? 'border-[#9491f5]' : 'border-gray-300'}`}
                    onPress={() => handleGenderSelect(g)}>
                    <Text className="text-gray-600">
                      {g === 'male' ? '남' : g === 'female' ? '여' : '선택 안함'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text className="mb-1 mt-5 text-sm font-medium text-[#333]">생년월일*</Text>
              <View
                className="mb-5 flex-row items-center border-b py-1"
                style={{
                  borderBottomColor: '#D1D5DB',
                  borderBottomWidth: 1,
                }}>
                <Ionicons name="calendar-outline" size={20} color="#CECECE" className="mr-2" />
                <TextInput
                  className="h-[40px] flex-1 px-1 text-[#333]"
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#CECECE"
                  value={formData.birthDate}
                  onChangeText={(text) => handleInputChange('birthDate', text)}
                  onFocus={() => setFocusedInput('birthDate')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>
            <TouchableOpacity
              className="mt-2 w-full overflow-hidden rounded-xl"
              onPress={handleSignUp}>
              <LinearGradient
                colors={['#94A0FF', '#D2B6FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="items-center rounded-xl py-4">
                <Text className="text-base font-semibold text-white">회원가입</Text>
              </LinearGradient>
            </TouchableOpacity>
            <View className="mb-8 mt-3 flex-row">
              <Text className="mr-1 text-gray-500">계정이 있으신가요?</Text>
              <TouchableOpacity onPress={() => router.push({ pathname: '/(public)/login' })}>
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
