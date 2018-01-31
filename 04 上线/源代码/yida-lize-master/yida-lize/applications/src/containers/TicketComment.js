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
  addTicketComment,
  resetTicket,
} from '../actions/tickets';

class TicketNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket_id: props.match.params.ticket_id,
      user_comment: '',
      toastTimer: null,
    };
  }

  componentWillUnmount() {
    this.state.toastTimer && clearTimeout(this.state.toastTimer);
  }
  delayReset() {
    const history = this.props.history;
    this.state.toastTimer = setTimeout(() => {
      this.props.resetTicket();
      // back
      history.goBack();
    }, 2000);
  }
  addTicketComment() {
    this.props.addTicketComment({
      ...this.state,
    });
  }

  render() {
    const {
      tickets: {
        adding, error, added,
      },
    } = this.props;
    if (added) {
      this.delayReset();
    }
    return (
      <Page title="评价" spacing history={this.props.history}>
        <Toast icon="success-no-circle" show={added}>评价成功</Toast>
        <Form>
          <FormCell>
            <CellBody>
              <TextArea
                placeholder="您对本次服务满意吗？写点意见帮助我们改进吧，长度在200字以内，谢谢."
                rows="3"
                maxLength={200}
                onChange={e => this.setState({
                    user_comment: e.target.value,
                })}
              />
            </CellBody>
          </FormCell>
        </Form>
        <ButtonArea>
          <Button
            onClick={e => this.addTicketComment()}
          >
            提交评价
          </Button>
        </ButtonArea>
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  tickets: state.tickets,
});

const mapDispatchToProps = dispatch => ({
  addTicketComment: data => dispatch(addTicketComment(data)),
  resetTicket: () => dispatch(resetTicket()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TicketNew));
