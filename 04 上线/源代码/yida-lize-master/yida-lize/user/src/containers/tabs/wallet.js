import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import {
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
  View,
} from 'native-base';
import constants from '../../constants/';

import styles from '../../styles';

class WalletScreen extends Component {
  handleApplication(e, item) {
    this.props.navigationScreen(item);
  }
  handleParkService(e) {
    this.props.navigationScreen({
      title: '停车服务',
      uri: '/applications/parking_service',
    });
  }

  render() {
    const {
      auth: {
        user,
        user: {
          funcs,
        },
      },
    } = this.props;
    return (
      <Container style={styles.container}>
        {
          user && user.ecard && user.role !== '访客' ? (
            <Content>
              <List>
                <ListItem
                  icon
                  button
                  last
                >
                  <Left>
                    <Button transparent>
                      <Icon active name="medal" style={{ fontSize: 28, color: '#e74c3c' }} />
                    </Button>
                  </Left>
                  <Body>
                    <Text>当前余额</Text>
                  </Body>
                  <Right>
                    <Text>{user.ecard.balance}</Text>
                  </Right>
                </ListItem>
              </List>
              {
                funcs.wallet.map((item, i) => (
                  <List
                    key={i}
                    style={{ backgroundColor: '#ffffff' }}
                    >
                    <ListItem
                      itemDivider
                    />
                    {
                      (item && item.children) ? item.children.map((leaf, j) => (
                        <ListItem
                          icon
                          button
                          key={j}
                          last={leaf.last}
                          onPress={e => this.handleApplication(e, leaf)}
                          >
                          <Left>
                            <Button transparent>
                              <Icon active name={leaf.icon} style={{ fontSize: 28, color: leaf.color }} />
                            </Button>
                          </Left>
                          <Body>
                            <Text>{leaf.title}</Text>
                          </Body>
                          <Right>
                            <Icon name="arrow-forward" />
                          </Right>
                        </ListItem>
                      )) : null
                    }
                  </List>
                ))
              }
              <ListItem
                itemDivider
              />
              <List>
                <ListItem
                  icon
                  button
                  key="parking_service"
                  last
                  onPress={e => this.handleParkService(e)}
                >
                  <Left>
                    <Button transparent>
                      <Icon active name="car" style={{ fontSize: 28, color: '#3498db' }} />
                    </Button>
                  </Left>
                  <Body>
                    <Text>停车服务</Text>
                  </Body>
                  <Right>
                    <Icon name="arrow-forward" />
                  </Right>
                </ListItem>
              </List>
            </Content>
          ) : null
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(WalletScreen);
