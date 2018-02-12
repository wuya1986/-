import {
  Dimensions,
  StyleSheet,
} from 'react-native';

const deviceHeight = Dimensions.get('window').height;

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
    width: 180,
    height: 130,
    resizeMode: 'cover',
  },
});

export default styles;
