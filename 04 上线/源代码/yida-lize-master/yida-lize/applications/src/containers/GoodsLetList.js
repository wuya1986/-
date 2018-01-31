import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Link,
  withRouter,
} from 'react-router-dom';

import {
  Button,
  ButtonArea,
  MediaBox,
  MediaBoxBody,
  MediaBoxDescription,
  MediaBoxHeader,
  MediaBoxTitle,
  MediaBoxInfo,
  MediaBoxInfoMeta,
  Panel,
  PanelBody,
  Toast,
} from 'react-weui';
import moment from 'moment';

import Page from '../components/page';
import {
  fetchTickets,
} from '../actions/tickets';
import constants from '../constants/';

class GoodsLetList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket_template: props.match.params.goods_let_type,
    };
  }
  componentDidMount() {
    this.props.fetchTickets(`ticket_template=${this.state.ticket_template}`);
  }

  openTicket(ticket) {
    this.props.history.push(`/tickets/show/${this.state.ticket_template}/${ticket._id}`);
  }

  render() {
    const { tickets, loading, error } = this.props.tickets;

    return (
      <Page className="button" spacing>
        <Toast icon="loading" show={loading}>Loading...</Toast>
        {
          error ? (<div className="alert alert-danger">Error: {error}</div>) : null
        }
        { !loading && !error ? (
          <Panel>
            <PanelBody>
              {
                  (tickets.length > 0) ? (
                    tickets.map((ticket, i) => (
                      <MediaBox
                        type="appmsg"
                        href="javascript:void(0);"
                        key={i}
                        onClick={() => this.openTicket(ticket)}
                      >
                        <MediaBoxHeader>
                          <img
                            src={`${constants.REMOTE_URL}/images/${this.state.ticket_template}.png`}
                            style={{ width: 36, height: 36 }}
                          />
                        </MediaBoxHeader>
                        <MediaBoxBody>
                          <MediaBoxTitle>
                            <div dangerouslySetInnerHTML={{ __html: ticket.content }} />
                          </MediaBoxTitle>
                          <MediaBoxInfo>
                            <MediaBoxInfoMeta>{ticket.from_user.fullname}</MediaBoxInfoMeta>
                            <MediaBoxInfoMeta>{moment(ticket.create_date).format('YYYY-MM-DD')}</MediaBoxInfoMeta>
                            <MediaBoxInfoMeta extra>{ticket.progress}</MediaBoxInfoMeta>
                          </MediaBoxInfo>
                        </MediaBoxBody>
                      </MediaBox>
                    ))
                  ) : (
                    <div />
                  )
                }
            </PanelBody>
          </Panel>
        ) : null
        }
        <ButtonArea>
          <Link to={`/tickets/new/${this.state.ticket_template}/${this.state.ticket_template}`}>
            <Button>添加</Button>
          </Link>
        </ButtonArea>
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  tickets: state.tickets,
});

const mapDispatchToProps = dispatch => ({
  fetchTickets: criteria => dispatch(fetchTickets(criteria)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GoodsLetList));
