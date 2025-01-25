import { Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

export const LAYOUT_CONSTANTS = {
    screenWidth: width,
    screenHeight: height,
    horizontalPadding: 8,
    borderRadius: 20,
    marginBottom: 8,
    marginTop: Platform.OS === 'ios' ? 70 : 50,
    statusBarHeight: StatusBar.currentHeight || 0,
};