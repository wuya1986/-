import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import {
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  Badge,
  Body,
  Button,
  Container,
  Content,
  Icon,
  Left,
  List,
  ListItem,
  Right,
  Separator,
  Text,
} from 'native-base';
import PhotoUpload from 'react-native-photo-upload';
import constants from '../../constants/';

import styles from '../../styles';

import { logout, resetMessageBadge } from '../../actions/auth';
import { avatar } from '../../actions/upload';

class MineScreen extends Component {
  handleUserCertification(e) {
    this.props.userCertificationScreen();
  }
  handleMyMessageList(e) {
    this.props.navigationScreen({
      id: 'my_message_list',
      title: '消息中心',
      color: '#16a085',
      icon: 'notifications',
      uri: '/applications/messages/list',
    });
    this.props.resetMessageBadge(0);
  }
  handleUserPrivacy(e) {
    this.props.navigationScreen({
      title: '隐私政策',
      uri: '/applications/contents/show/yin-si-zheng-ce',
    });
  }
  handleLogout(e) {
    this.props.logout();
  }
  handleApplication(e, item) {
    this.props.navigationScreen(item);
  }
  avatar(avatar) {
    console.log(avatar);
    if (avatar) {
      if (avatar.startsWith('http')) {
        return avatar;
      }
      return `${constants.FILE_URL}/${avatar}`;
    }
    return `${constants.FILE_URL}/avatars/avatar.svg`;
  }

  render() {
    const {
      auth: {
        loading, user, error,
        user: {
          badge,
        },
      },
    } = this.props;
    return (
      <Container style={styles.container}>
        <Content>
          <List>
            <ListItem>
              <Left>
                <PhotoUpload
                  photoPickerTitle="选择照片"
                  cancelButtonTitle="取消"
                  takePhotoButtonTitle="拍照"
                  chooseFromLibraryButtonTitle="相册"
                  onPhotoSelect={(avatar) => {
                      if (avatar) {
                        this.props.avatar({
                          avatar,
                        });
                      }
                  }}
                >
                  <Image
                    style={{
                      paddingVertical: 30,
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                    }}
                    resizeMode="cover"
                    source={{
                      uri: this.avatar(user.avatar),
                    }}
                  />
                </PhotoUpload>
              </Left>
              <Text>{user.fullname} - {user.mobile_no}</Text>
            </ListItem>
            <Separator bordered noTopBorder />
            { (loading) ?
              <ActivityIndicator /> : null
            }
            {
              (user.role === '访客') ? (
                <ListItem icon last button onPress={e => this.handleUserCertification(e)}>
                  <Left>
                    <Button style={{ backgroundColor: '#79B7FF' }}>
                      <Icon active name="lock" />
                    </Button>
                  </Left>
                  <Body>
                    <Text>申请认证{user.request_employee === '申请' ? '中...' : ''} - {user.role}</Text>
                  </Body>
                  <Right>
                    <Icon active name="arrow-forward" />
                  </Right>
                </ListItem>
              ) : (
                <ListItem icon last>
                  <Left>
                    <Button style={{ backgroundColor: '#79B7FF' }}>
                      <Icon active name="lock" />
                    </Button>
                  </Left>
                  <Body>
                    <Text>{user.company ? user.company.company_name : ''} - {user.role}</Text>
                  </Body>
                  <Right />
                </ListItem>
              )
            }
            <Separator bordered />
            <ListItem icon button onPress={e => this.handleMyMessageList(e)}>
              <Left>
                <Button style={{ backgroundColor: '#79B7FF' }}>
                  <Icon active name="notifications" />
                </Button>
              </Left>
              <Body>
                <Text>消息中心</Text>
              </Body>
              <Right>
                {
                  badge && badge.mine && badge.mine.messages > 0 ? (
                    <Badge style={{ backgroundColor: '#3498DB' }}>
                      <Text>{badge.mine.messages}</Text>
                    </Badge>
                  ) : (
                    <Icon active name="arrow-forward" />
                  )
                }
              </Right>
            </ListItem>
            <ListItem last icon button onPress={e => this.props.userTicketListScreen()}>
              <Left>
                <Button style={{ backgroundColor: '#79B7FF' }}>
                  <Icon active name="list" />
                </Button>
              </Left>
              <Body>
                <Text>待办事项</Text>
              </Body>
              <Right>
                {
                  badge && badge.mine && badge.mine.tickets > 0 ? (
                    <Badge style={{ backgroundColor: '#3498DB' }}>
                      <Text>{badge.mine.tickets}</Text>
                    </Badge>
                  ) : (
                    <Icon active name="arrow-forward" />
                  )
                }
              </Right>
            </ListItem>

            <Separator bordered />

            <ListItem icon>
              <Left>
                <Button style={{ backgroundColor: '#79B7FF' }}>
                  <Icon active name="cog" />
                </Button>
              </Left>
              <Body>
                <Text>版本(B1.4.10)</Text>
              </Body>
              <Right />
            </ListItem>
            <ListItem last icon button onPress={e => this.handleUserPrivacy()}>
              <Left>
                <Button style={{ backgroundColor: '#79B7FF' }}>
                  <Icon active name="hand" />
                </Button>
              </Left>
              <Body>
                <Text>隐私保护条款</Text>
              </Body>
              <Right>
                <Icon active name="arrow-forward" />
              </Right>
            </ListItem>

            <Separator bordered />

            <ListItem last icon button onPress={e => this.handleLogout(e)}>
              <Left>
                <Button style={{ backgroundColor: '#79B7FF' }}>
                  <Icon active name="log-out" />
                </Button>
              </Left>
              <Body>
                <Text>退出</Text>
              </Body>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  logout: () =>
    dispatch(logout()),
  avatar: info =>
    dispatch(avatar(info)),
  resetMessageBadge: messages => dispatch(resetMessageBadge(messages)),
  userCertificationScreen: params =>
    dispatch(NavigationActions.navigate({ routeName: 'UserCertification', params })),
  userTicketListScreen: params =>
    dispatch(NavigationActions.navigate({ routeName: 'UserTicketList', params })),
  navigationScreen: item =>
    dispatch(NavigationActions.navigate({
      routeName: 'WebView',
      params: {
        ...item,
      },
    })),
});

export default connect(mapStateToProps, mapDispatchToProps)(MineScreen);
