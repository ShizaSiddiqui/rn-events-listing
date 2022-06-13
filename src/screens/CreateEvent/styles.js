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
  datePicker: {
    marginTop: hp(2),
    marginHorizontal: wp(3),
    alignItems: 'flex-start',
    borderColor: Colors.olive,
    borderWidth: 1,
    marginBottom: hp(1),
  },
  textInputView: {
    alignItems: 'center',
    borderColor: Colors.olive,
    borderWidth: 1,
    marginTop: hp(2),
    marginHorizontal: wp(3),
  },

  timeOpacityView: {
    flex: 1,
    marginTop: hp(2),
    marginHorizontal: wp(3),
  },

  container: {
    flex: 1,
    marginHorizontal: 20,
  },

  boldText: {
    color: 'black',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
  },
  dateStyle: {
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
});
