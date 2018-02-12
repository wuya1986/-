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
  addTicketClosed,
  resetTicket,
  fetchTicket,
} from '../actions/tickets';

class PropertyRepairShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket_id: props.match.params.ticket_id,
      user_closed: true,
    };
  }

  componentWillUnmount() {
    this.state.toastTimer && clearTimeout(this.state.toastTimer);
  }

  componentDidMount() {
    this.props.fetchTicket(this.state.ticket_id);
  }
  delayReset() {
    const history = this.props.history;
    this.state.toastTimer = setTimeout(() => {
      this.props.resetTicket();
      history.goBack();
    }, 2000);
  }

  addTicketClosed() {
    this.props.addTicketClosed({
      ...this.state,
    });
  }

  render() {
    const {
      tickets: {
        adding, added,
      },
      ticket: {
        ticket, loading, error,
      },
    } = this.props;
    if (added) {
      this.delayReset();
    }
    return (
      <Page className="preview" history={this.props.history} ticket_indicates={ticket ? ticket.ticket_indicates : null}>
        <Toast icon="success-no-circle" show={added}>确认成功</Toast>
        <Toast icon="loading" show={adding || loading}>Loading...</Toast>
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
                      <p>租户名称</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.property_repair_company_name}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>报修人</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.property_repair_user}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>报修内容</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.property_repair_content}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>材料费</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.property_repair_material_type}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>配件名称</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.property_repair_material_name}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>配件数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.property_repair_material_total}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>工时</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.property_repair_time}</p>
                    </CellFooter>
                  </Cell>
                  {
                      ticket.form_data.property_repair_result ? (
                        <Cell>
                          <CellBody>
                            <p>处理结果</p>
                          </CellBody>
                          <CellFooter>
                            <p>{ticket.form_data.property_repair_result}</p>
                          </CellFooter>
                        </Cell>
                      ) : null
                    }
                  { ticket && ticket.user_comment ? (
                    <Cell>
                      <CellBody>
                        <p>我的评价</p>
                      </CellBody>
                      <CellFooter>
                        <p>{ticket.user_comment}</p>
                      </CellFooter>
                    </Cell>
                    ) : null
                    }
                </Cells>
              </MediaBox>
            </PanelBody>
          </Panel>
        ) : null
        }
        <ButtonArea>
          { ticket ? (
            <Button
              disabled={!!(ticket.user_comment || ticket.progress != '处理完毕' || adding)}
              onClick={e => this.props.history.push(`/tickets/comment/${ticket._id}`)}
            >
              评价
            </Button>
          ) : null
          }
      { ticket ? (
        <Button
          type="warn"
          disabled={ticket.user_closed || ticket.progress != '处理完毕' || adding}
          onClick={e => this.addTicketClosed()}
        >
          确认
        </Button>
      ) : null
      }
        </ButtonArea>
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  ticket: state.ticket,
  tickets: state.tickets,
});

const mapDispatchToProps = dispatch => ({
  fetchTicket: id => dispatch(fetchTicket(id)),
  addTicketClosed: data => dispatch(addTicketClosed(data)),
  resetTicket: () => dispatch(resetTicket()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PropertyRepairShow));
