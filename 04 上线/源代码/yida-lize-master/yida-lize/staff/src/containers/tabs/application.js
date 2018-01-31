import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import {
  Badge,
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
} from 'native-base';

import styles from '../../styles';

class ApplicationScreen extends Component {
  handleApplication(e, item) {
    if (item.uri) {
      this.props.navigationScreen(item);
    }
  }

  applicationItem(item, i) {
    const {
      auth: {
        staff: {
          badge,
        },
      },
    } = this.props;
    const count = 0;
    /* if (badge.applications) {
     *   for (const a of badge.applications) {
     *     if (a && a._id == item.id) {
     *       count = a.count;
     *       break;
     *     }
     *   }
     * }*/
    return (
      <ListItem
        icon={!item.divider}
        button={!item.divider}
        key={i}
        itemDivider={item.divider}
        last={item.last}
        onPress={e => this.handleApplication(e, item)}
      >
        {
          item.divider ? null : (
            <Left>
              <Button style={{ backgroundColor: item.color }}>
                <Icon active name="list" />
              </Button>
            </Left>
          )
        }
        {
          item.divider ? (
            <Text>{item.title}</Text>
          ) : (
            <Body>
              <Text>{item.title}</Text>
            </Body>
          )
        }
        {
          item.divider ? null : (
            <Right>
              {
                count > 0 ? (
                  <Badge style={{ backgroundColor: '#3498db' }}>
                    <Text>{count}</Text>
                  </Badge>
                ) : (
                  <Icon active name="arrow-forward" />
                )
              }
            </Right>
          )
        }
      </ListItem>
    );
  }

  render() {
    const {
      auth: {
        staff: {
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
          <List>
            {
              funcs.applications.map((item, i) => this.applicationItem(item, i))
            }
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
  navigationScreen: item =>
    dispatch(NavigationActions.navigate({
      routeName: 'WebView',
      params: {
        ...item,
      },
    })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationScreen);
