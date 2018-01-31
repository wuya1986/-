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

const messageItem = {
  title: '消息中心',
  uri: `${constants.REMOTE_URL}/crud/my_messages`,
};

const ticketItem = {
  title: '待办事项',
  uri: `${constants.REMOTE_URL}/crud/my_tickets`,
};

class MineScreen extends Component {
  handleStaffProfile(e) {
    this.props.staffProfileScreen();
  }
  handleLogout(e) {
    this.props.logout();
  }
  handleApplication(e, item) {
    this.props.navigationScreen(item);
    this.props.resetMessageBadge(0);
  }

  render() {
    const {
      auth: {
        loading, error, staff,
        staff: {
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
                      uri: `${constants.FILE_URL}/${staff.avatar}`,
                    }}
                  />
                </PhotoUpload>
              </Left>
              <Text>{staff.fullname} - {staff.username}</Text>
            </ListItem>
            <Separator bordered noTopBorder />
            { (loading) ?
              <ActivityIndicator /> : null
            }
            <ListItem last icon button onPress={e => this.handleStaffProfile(e)}>
              <Left>
                <Button style={{ backgroundColor: '#79b7ff' }}>
                  <Icon active name="lock" />
                </Button>
              </Left>
              <Body>
                <Text>个人信息</Text>
              </Body>
              <Right>
                <Icon active name="arrow-forward" />
              </Right>
            </ListItem>

            <Separator bordered />

            <ListItem icon button onPress={e => this.handleApplication(e, messageItem)}>
              <Left>
                <Button transparent>
                  <Icon active name="notifications" style={{ fontSize: 28, color: '#16a085' }} />
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
            <ListItem last icon button onPress={e => this.handleApplication(e, ticketItem)}>
              <Left>
                <Button transparent>
                  <Icon active name="list" style={{ fontSize: 28, color: '#f39c12' }} />
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

            <ListItem icon last>
              <Left>
                <Button transparent>
                  <Icon active name="cog" style={{ fontSize: 28, color: '#c0392b' }} />
                </Button>
              </Left>
              <Body>
                <Text>版本(B1.4.10)</Text>
              </Body>
              <Right />
            </ListItem>

            <Separator bordered />

            <ListItem last icon button onPress={e => this.handleLogout(e)}>
              <Left>
                <Button transparent>
                  <Icon active name="log-out" style={{ fontSize: 28, color: '#f1c40f' }} />
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
  staffProfileScreen: params =>
    dispatch(NavigationActions.navigate({ routeName: 'StaffProfile', params })),
  navigationScreen: item =>
    dispatch(NavigationActions.navigate({
      routeName: 'WebView',
      params: {
        ...item,
      },
    })),
});

export default connect(mapStateToProps, mapDispatchToProps)(MineScreen);
