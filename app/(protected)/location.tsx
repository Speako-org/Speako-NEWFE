import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Platform } from 'react-native';

// 카카오맵 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

export default function Location() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

  // 현재 위치 가져오기
  const getCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          // 기본 위치 설정 (서울시청)
          setCurrentPosition({ lat: 37.5665, lng: 126.978 });
        }
      );
    } else {
      // 기본 위치 설정 (서울시청)
      setCurrentPosition({ lat: 37.5665, lng: 126.978 });
    }
  };

  useEffect(() => {
    getCurrentPosition();
  }, []);

  useEffect(() => {
    // 카카오맵 스크립트가 이미 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps) {
      setIsKakaoLoaded(true);
      return;
    }

    // 카카오맵 스크립트 로드
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_MAP_API_KEY&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsKakaoLoaded(true);
      });
    };
    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isKakaoLoaded && currentPosition && mapRef.current) {
      initMap();
    }
  }, [isKakaoLoaded, currentPosition]);

  const initMap = () => {
    if (!mapRef.current || !currentPosition || !window.kakao?.maps) return;

    try {
      const mapContainer = mapRef.current;
      const mapOption = {
        center: new window.kakao.maps.LatLng(currentPosition.lat, currentPosition.lng),
        level: 3,
      };

      // 지도 생성
      const newMap = new window.kakao.maps.Map(mapContainer, mapOption);
      setMap(newMap);

      // 현재 위치에 마커 생성
      const markerPosition = new window.kakao.maps.LatLng(currentPosition.lat, currentPosition.lng);
      const newMarker = new window.kakao.maps.Marker({
        position: markerPosition,
        map: newMap,
      });
      setMarker(newMarker);

      // 현재 위치로 지도 이동
      newMap.setCenter(markerPosition);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const handleSearch = () => {
    if (!searchKeyword || !map || !window.kakao?.maps) return;

    try {
      // 장소 검색 객체 생성
      const places = new window.kakao.maps.services.Places();

      // 키워드로 장소 검색
      places.keywordSearch(searchKeyword, (results: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          // 검색된 장소 위치로 이동
          const bounds = new window.kakao.maps.LatLngBounds();

          // 검색 결과의 첫 번째 장소로 이동
          const firstResult = results[0];
          const coords = new window.kakao.maps.LatLng(firstResult.y, firstResult.x);

          // 기존 마커 제거
          if (marker) {
            marker.setMap(null);
          }

          // 새로운 마커 생성
          const newMarker = new window.kakao.maps.Marker({
            position: coords,
            map: map,
          });
          setMarker(newMarker);

          // 지도 이동
          map.setCenter(coords);
          map.setLevel(3);

          // 검색 결과의 영역을 지도에 표시
          bounds.extend(coords);
          map.setBounds(bounds);
        } else {
          alert('검색 결과가 없습니다.');
        }
      });
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          onKeyPress={handleKeyPress}
          placeholder="장소를 검색하세요"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity>
      </View>
      <div ref={mapRef} style={styles.map} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#65558F',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
    width: '100%',
  },
});
