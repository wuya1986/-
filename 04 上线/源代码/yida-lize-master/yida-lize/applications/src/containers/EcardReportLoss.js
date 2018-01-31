import React, { Component } from 'react';

import {
  Button,
  ButtonArea,
  Toast,
} from 'react-weui';

import Page from '../components/page';

//http://localhost:3000/applications/ecard_report_loss
class EcardReportLoss extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showToptips: false,
    };
  }
  render() {
    return (
      <Page title="一卡通挂失" subTitle="一卡通的线上挂失，挂失后所有一卡通的功能无效" spacing>
        <Toast icon="loading" show={this.state.showToptips}>一卡通挂失功能尚未实现</Toast>
        <ButtonArea>
          <Button
            type="warn"
            onClick={(e) => {
                if (this.state.showToptips) return;
                this.setState({ showToptips: !this.state.showToptips });
                window.setTimeout(e => this.setState({ showToptips: !this.state.showToptips }), 2000);
            }
            }
          >
            一键挂失
          </Button>
        </ButtonArea>
      </Page>
    );
  }
}

export default EcardReportLoss;
