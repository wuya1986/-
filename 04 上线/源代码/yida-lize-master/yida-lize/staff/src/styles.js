import {
  Dimensions,
  Platform,
  StyleSheet,
} from 'react-native';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginTop: 15,
  },
  content: {
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    padding: 5,
  },
  labelview: {
    flex: 1,
  },
  label120: {
    width: 120,
  },
  label150: {
    width: 150,
  },
  label240: {
    width: 240,
  },
  input: {
    flex: 2,
  },
  formlabel: {
    marginLeft: 10,
    marginRight: 0,
  },
  picker: {
    marginLeft: 20,
    width: 150,
  },
  date_picker: {
    width: 163,
    right: 18,
    marginTop: 10,
  },
  modalpicker: {
    width: 163,
    right: 18,
    marginTop: 10,
  },
  modalpicker_text: {
    borderWidth: 0.8,
    borderColor: '#ccc',
    padding: 10,
    height: 40,
  },
  switch: {
    right: 10,
    marginTop: 10,
  },
  memo: {
    marginTop: 10,
  },
  text: {
    marginTop: 20,
  },
  slider: {
    width: 193,
    right: 4,
    marginTop: 15,
  },
  forminput_100_right: {
    textAlign: 'right',
    width: 80,
  },
  forminput_170_left: {
    textAlign: 'left',
    width: 170,
  },
  forminput_170_right: {
    textAlign: 'right',
    width: 170,
  },
  forminput_190_left: {
    textAlign: 'left',
    width: 190,
  },

  drawerCover: {
    alignSelf: 'stretch',
    height: deviceHeight / 3.5,
    position: 'relative',
  },
  drawerImage: {
    position: 'absolute',
    left: Platform.OS === 'android' ? deviceWidth / 6 : deviceWidth / 7,
    top: Platform.OS === 'android' ? deviceHeight / 30 : deviceHeight / 31,
    width: 240,
    height: 130,
    resizeMode: 'cover',
  },
});

export default styles;
