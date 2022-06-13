import { StyleSheet } from 'react-native';
import * as Colors from '../../assests/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  fullContainer: {
    flex: 1,
  },
  buttonView: {
    justifyContent: 'center',
    height: hp(6),
    marginHorizontal: wp(3),
    marginTop: hp(3),
    backgroundColor: Colors.olive,
    borderRadius: 6,
  },
});
