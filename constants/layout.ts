import { Dimensions, Platform, StatusBar } from 'react-native';
import {
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window');

export const LAYOUT_CONSTANTS = {
    screenWidth: width,
    screenHeight: height,
    horizontalPadding: Platform.OS == "ios" ? 12 : 8,
    borderRadius: 20,
    // marginBottom: Platform.OS == "ios" ? 18 : 8,
    marginBottom: Platform.OS == "ios" ? 16 : 13,
    // marginTop: Platform.OS === 'ios' ? 70 : 50,
    marginTop: Platform.OS === 'ios' ? 60 : 46,
    statusBarHeight: StatusBar.currentHeight || 0,
};