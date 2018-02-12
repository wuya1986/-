import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
  Button,
  ButtonArea,
  Cell,
  CellBody,
  CellFooter,
  Cells,
  MediaBox,
  MediaBoxDescription,
  Panel,
  PanelBody,
  PanelHeader,
  Toast,
} from 'react-weui';
import QRCode from 'qrcode.react';

import Page from '../components/page';
import {
  fetchTicket,
} from '../actions/tickets';

// http://localhost:3000/tickets/show/3456789
class TicketDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket_id: props.match.params.ticket_id,
      content: '',
    };
  }

  componentDidMount() {
    this.props.fetchTicket(this.state.ticket_id);
  }

  render() {
    const {
      ticket: {
        ticket, loading, error,
      },
    } = this.props;
    return (
      <Page className="button" spacing history={this.props.history}>
        <Toast icon="loading" show={loading}>Loading...</Toast>
        {
          error ? (<div className="alert alert-danger">Error: {error}</div>) : null
        }
        { ticket ? (
          <Panel>
            <PanelHeader>
              {ticket.ticket_template.title}
            </PanelHeader>
            <PanelBody>
              <MediaBox type="text">
                <Cells>
                  {
                      (ticket.to && ticket.to.length > 0) ? (
                        <Cell>
                          <CellBody>
                            <p>负责人</p>
                          </CellBody>
                          <CellFooter>
                            {ticket.to[0].fullname}
                          </CellFooter>
                        </Cell>
                      ) : null
                    }
                  <Cell>
                    <CellBody>
                      <p>发起人</p>
                    </CellBody>
                    <CellFooter>
                      {ticket.from_user.fullname}
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>进度</p>
                    </CellBody>
                    <CellFooter>
                      {ticket.progress}
                    </CellFooter>
                  </Cell>
                </Cells>
                <MediaBoxDescription>
                  {ticket.content}
                </MediaBoxDescription>
              </MediaBox>
            </PanelBody>
          </Panel>
        ) : null
        }
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  ticket: state.ticket,
});

const mapDispatchToProps = dispatch => ({
  fetchTicket: id => dispatch(fetchTicket(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TicketDetail));
