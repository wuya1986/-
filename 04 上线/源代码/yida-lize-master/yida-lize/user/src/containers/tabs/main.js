import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
  Image,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Icon,
  Right,
  Left,
} from 'native-base';
import Swiper from 'react-native-swiper';
import GridView from 'react-native-super-grid';
import constants from '../../constants/';
import moment from 'moment';

import Svg from '../../components/Svg';

const drawerImage = require('../../assets/notice_center.png');

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
    paddingTop: 6,
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
    fontSize: 14,
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

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      swiperShow: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ swiperShow: true });
    }, 0);
  }

  handlePage(e, item) {
    this.props.navigationScreen(item);
  }
  handleMyMessageList(e) {
    this.props.navigationScreen({
      id: 'my_message_list',
      title: '消息中心',
      color: '#16a085',
      icon: 'notifications',
      uri: '/applications/messages/list',
    });
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
          { this.state.swiperShow ? (
            <Swiper
              autoplay
              autoplayTimeout={5}
              style={styles.wrapper}
              height={220}
              dot={<View style={styles.swiperDot} />}
              activeDot={<View style={styles.swiperActiveDot} />}
            >
              {
                  funcs.swipers.map((item, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.slide}
                      onPress={e => this.handlePage(e, {
                          ...item,
                      })}
                    >
                      <Image
                        resizeMode="stretch"
                        style={styles.image}
                        source={{ uri: `${constants.CMS_URL}${item.thumbnail.src}` }}
                      />
                    </TouchableOpacity>
                  ))
                }
            </Swiper>
          ) : null
          }
          {
            funcs.notice ? (
              <Card style={styles.mb}>
                <CardItem button onPress={e => this.handleMyMessageList(e)}>
                  <Image
                    square
                    style={{
                      width: 32,
                      height: 32,
                      resizeMode: 'cover',
                    }}
                    source={drawerImage}
                  />

                  <Text style={{ marginLeft: 12 }}>
                    {funcs.notice.content}
                  </Text>
                </CardItem>
              </Card>
            ) : null
          }
          <GridView
            itemWidth={90}
            items={funcs.shortcuts}
            style={styles.gridView}
            spacing={2}
            renderItem={(item, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.itemContainer, { backgroundColor: '#ffffff' }]}
                onPress={e => this.handlePage(e, item)}
              >
                <Svg icon={item.id} size="60" color="#64b9fb" />
                <Text
                  style={styles.itemName}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
          />
          {
            funcs.news.map((item, i) => (
              <Card
                key={i}
              >
                <CardItem bordered>
                  <Left>
                    <Body>
                      <Text>{item.user ? item.user.fullanme : ''}</Text>
                      <Text note>{moment(item.date).format('YYYY-MM-DD')}</Text>
                    </Body>
                  </Left>
                </CardItem>

                <CardItem
                  button
                  onPress={e => this.handlePage(e, {
                      title: item.title,
                      uri: `/applications/contents/show/${item.alias}`,
                  })}
                >
                  <Body>
                    <Image
                      style={{
                        alignSelf: 'center',
                        height: 150,
                        resizeMode: 'cover',
                        width: deviceWidth / 1.18,
                        marginVertical: 5,
                      }}
                      source={{ uri: item.thumbnail ? `${constants.CMS_URL}${item.thumbnail.src}` : '' }}
                    />
                    <Text>
                      {item.title}
                    </Text>
                  </Body>
                </CardItem>
                <CardItem style={{ paddingVertical: 0 }}>
                  <Left>
                    <Button transparent>
                      <Text>{item.reading ? item.reading.total : ''}</Text>
                    </Button>
                  </Left>
                </CardItem>
              </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
