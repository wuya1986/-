import React, { Component } from 'react';

import {
  Agreement,
  Button,
  ButtonArea,
  CellBody,
  CellsTitle,
  Form,
  FormCell,
  TextArea,
  Toast,
} from 'react-weui';

import Page from '../components/page';

//http://localhost:3000/applications/ecard_cancellation
class EcardCancellation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showToptips: false,
    };
  }
  render() {
    return (
      <Page title="注销一卡通" subTitle="注销成功之后，将失去员工身份" spacing>
        <Toast icon="loading" show={this.state.showToptips}>一卡通注销功能尚未实现</Toast>
        <CellsTitle>注销理由</CellsTitle>
        <Form>
          <FormCell>
            <CellBody>
              <TextArea
                placeholder="请输入注销理由"
                rows="3"
                maxLength={200}
              />
            </CellBody>
          </FormCell>
        </Form>
        <Agreement>
      &nbsp;&nbsp;我同意 <a href="javascript:;">一卡通注销条款</a>
        </Agreement>
        <ButtonArea>
          <Button
            //button to display toptips
            onClick={(e) => {
                if (this.state.showToptips) return;
                this.setState({ showToptips: !this.state.showToptips });
                window.setTimeout(e => this.setState({ showToptips: !this.state.showToptips }), 2000);
            }
            }
          >
            OK
          </Button>
        </ButtonArea>
      </Page>
    );
  }
}

export default EcardCancellation;
