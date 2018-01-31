import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import {
  Dimensions,
  Linking,
  TouchableOpacity,
} from 'react-native';

import {
  Body,
  Button,
  Container,
  Content,
  Icon,
  List,
  ListItem,
  Left,
  Right,
  Text,
  View,
} from 'native-base';
import GridView from 'react-native-super-grid';

import Svg from '../../components/Svg';

const deviceWidth = Dimensions.get('window').width;
const styles = {
  container: {
    flex: 1,
  },

  wrapper: {
  },

  slide: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
  },

  image: {
    width: deviceWidth,
    flex: 1,
  },
  gridView: {
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 0,
    padding: 10,
    height: 100,
  },
  itemName: {
    fontSize: 12,
    color: '#347591',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
  swiperDot: {
    backgroundColor: '#ccc',
    width: 5,
    height: 5,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  swiperActiveDot: {
    backgroundColor: '#fff',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
};

class ApplicationScreen extends Component {
  handleApplication(e, item) {
    if (item.uri.startsWith('http')) {
      Linking.canOpenURL(item.uri).then((supported) => {
        if (!supported) {
          console.log(`invalid url: ${item.uri}`);
        } else {
          return Linking.openURL(item.uri);
        }
      }).catch(err => console.error(err));
    } else {
      this.props.navigationScreen(item);
    }
  }

  render() {
    const {
      auth: {
        user: {
          funcs,
        },
      },
    } = this.props;
    if (!funcs) {
      return (<View />);
    }
    return (
      <Container style={styles.container}>
        <Content>
          {
            funcs.applications.map((item, i) => (
              <List
                key={i}
                style={{ backgroundColor: '#ffffff' }}
              >
                <ListItem
                  itemDivider
                >
                  <Text>{item.title}</Text>
                </ListItem>
                {
                  <GridView
                    itemWidth={90}
                    items={item.children}
                    style={styles.gridView}
                    spacing={2}
                    renderItem={(leaf, j) => (
                      <TouchableOpacity
                        key={j}
                        style={[styles.itemContainer]}
                        onPress={e => this.handleApplication(e, leaf)}
                      >
                        <Svg icon={leaf.id} size="48" color="#64b9fb" />
                        <Text
                          style={styles.itemName}
                        >
                          {leaf.title}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                }
              </List>
            ))
          }
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  navigationScreen: item =>
    dispatch(NavigationActions.navigate({
      routeName: 'WebView',
      params: {
        ...item,
      },
    })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationScreen);
