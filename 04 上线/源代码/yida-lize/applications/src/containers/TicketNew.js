import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
  Button,
  ButtonArea,
  CellsTitle,
  CellBody,
  Form,
  FormCell,
  Toast,
  TextArea,
} from 'react-weui';

import Page from '../components/page';
import {
  addTicket,
  resetTicket,
  fetchTicketTemplate,
} from '../actions/tickets';

// http://localhost:3000/tickets/new/reserve_visit
class TicketNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket_template: props.match.params.ticket_template,
      content: '',
      toastTimer: null,
    };
  }

  componentDidMount() {
    this.props.fetchTicketTemplate(this.state.ticket_template);
  }

  componentWillUnmount() {
    this.props.resetTicket();
    this.state.toastTimer && clearTimeout(this.state.toastTimer);
  }
  delayReset() {
    const history = this.props.history;
    this.state.toastTimer = setTimeout(() => {
      // back
      history.goBack();
    }, 2000);
  }
  addTicket() {
    this.props.addTicket({
      ...this.state,
      ticket_template: this.state.ticket_template,
    });
  }

  render() {
    const {
      ticket_template: {
        ticket_template, loading,
      },
      tickets: {
        adding, error, added,
      },
    } = this.props;
    if (added) {
      this.delayReset();
    }
    return (
      <Page title={ticket_template.title} spacing history={this.props.history}>
        <Toast icon="success-no-circle" show={added}>添加成功</Toast>
        <Toast icon="loading" show={adding || loading}>Loading...</Toast>
        <CellsTitle dangerouslySetInnerHTML={{ __html: ticket_template.user_guide }} />
        <Form>
          <FormCell>
            <CellBody>
              <TextArea
                placeholder="输入您要填写的内容"
                rows="3"
                maxLength={200}
                onChange={e => this.setState({
                    content: e.target.value,
                })}
              />
            </CellBody>
          </FormCell>
        </Form>
        <ButtonArea>
          <Button
            onClick={e => this.addTicket()}
          >
            提交申请
          </Button>
        </ButtonArea>
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  tickets: state.tickets,
  ticket_template: state.ticket_template,
});

const mapDispatchToProps = dispatch => ({
  addTicket: data => dispatch(addTicket(data)),
  fetchTicketTemplate: id => dispatch(fetchTicketTemplate(id)),
  resetTicket: () => dispatch(resetTicket()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TicketNew));
