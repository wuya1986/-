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
  Panel,
  PanelBody,
  Toast,
} from 'react-weui';

import Page from '../components/page';
import {
  fetchTicket,
} from '../actions/tickets';

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
      <Page className="preview" history={this.props.history} ticket_indicates={ticket ? ticket.ticket_indicates : null}>
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
                      <p>{ticket.form_data.batchly_visitor_name}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>来访日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.batchly_visitor_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>来访人数</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.batchly_visitor_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>审批结果</p>
                    </CellBody>
                    <CellFooter>
                      <p style={ticket.form_data.batchly_visitor_result === '拒绝' ? { color: 'red' } : null}>{ticket.form_data.batchly_visitor_result}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>审批意见</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.batchly_visitor_opinion}</p>
                    </CellFooter>
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
