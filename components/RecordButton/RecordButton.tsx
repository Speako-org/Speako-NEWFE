import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import recordingAnimation from '../../assets/recording.json';

interface RecordButtonProps {
  recording: boolean;
  onStartRecord: () => void;
  onStopRecord: () => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({ recording, onStartRecord, onStopRecord }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log('RecordButton pressed', recording);
        if (recording) onStopRecord();
        else onStartRecord();
      }}>
      <View
        className="elevation-4 h-[60px] w-[60px] items-center justify-center rounded-full bg-[#c2d2ff] shadow-sm"
        style={{
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 8,
        }}>
        {recording ? (
          <LottieView source={recordingAnimation} autoPlay loop style={{ width: 80, height: 80 }} />
        ) : (
          <Ionicons name="mic-outline" size={30} color="#888" />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default RecordButton;
