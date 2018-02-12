import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
  Button,
  ButtonArea,
  Cell,
  CellBody,
  CellFooter,
  CellHeader,
  Cells,
  MediaBox,
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
import constants from '../constants/';

class IndividualVisitorShow extends Component {
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
      <Page className="preview" history={this.props.history}>
        <Toast icon="loading" show={loading}>Loading...</Toast>
        {
          error ? (<div className="alert alert-danger">Error: {error}</div>) : null
        }
        { ticket ? (
          <Panel>
            <PanelBody>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>状态</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.progress}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>访客姓名</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.individual_visitor_name}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>来访日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.individual_visitor_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>来访目的</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.individual_visitor_purpose}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <QRCode value={`${constants.REMOTE_URL}/crud/property_repair/${ticket._id}`} />
                  </Cell>
                </Cells>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(IndividualVisitorShow));
