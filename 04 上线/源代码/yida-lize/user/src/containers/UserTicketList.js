import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import { NavigationActions } from 'react-navigation';
import moment from 'moment';

import {
  Container,
  Content,
  List,
  ListItem,
  Text,
  Body,
  Left,
  Right,
  Icon,
} from 'native-base';
import constants from '../constants/';

import styles from '../styles';
import {
  fetchTickets,
} from '../actions/tickets';

class UserTicketList extends Component {
  componentDidMount() {
    this.props.fetchTickets('delete_flag=false');
  }

  openTicket(ticket) {
    this.props.navigationScreen({
      title: ticket.ticket_template ? ticket.ticket_template.title : ticket.content,
      uri: `/tickets/show/${ticket.ticket_template._id}/${ticket._id}`,
    });
  }

  render() {
    const { tickets, loading, error } = this.props.tickets;

    return (
      <Container style={styles.container}>
        <Content>
          <List
            dataArray={tickets}
            renderRow={
              ticket => (
                <ListItem button onPress={() => this.openTicket(ticket)}>
                  <Left>
                    <Text
                      style={ticket.progress === '处理完毕' ? { color: '#808080' } : null}
                    >
                      {ticket.ticket_template ? ticket.ticket_template.title : ticket.content}
                    </Text>
                  </Left>
                  <Right style={{ flex: 1 }}>
                    <Text numberOfLines={1} note style={{ textAlign: 'right' }}>
                      {ticket.progress}
                    </Text>
                    <Text numberOfLines={1} note style={{ textAlign: 'right' }}>
                      {moment(ticket.create_date).format('YYYY-MM-DD')}
                    </Text>
                  </Right>
                </ListItem>
              )
            }
          />
          <Text style={{ color: '#FF0000', fontSize: 15, marginLeft: 15 }}>{error}</Text>
          { loading &&
            <ActivityIndicator size="large" />
          }
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  tickets: state.tickets,
});

const mapDispatchToProps = dispatch => ({
  fetchTickets: criteria => dispatch(fetchTickets(criteria)),
  navigationScreen: item =>
    dispatch(NavigationActions.navigate({
      routeName: 'WebView',
      params: {
        ...item,
      },
    })),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserTicketList);
