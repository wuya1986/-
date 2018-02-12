import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
  Button,
  ButtonArea,
  CellBody,
  CellHeader,
  CellsTips,
  CellsTitle,
  Form,
  FormCell,
  Input,
  Label,
  MediaBox,
  MediaBoxDescription,
  MediaBoxTitle,
  Panel,
  PanelBody,
  Toast,
} from 'react-weui';

import Page from '../components/page';
import {
  fetchContentsByAlias,
  unify,
  reset,
} from '../actions/contents';

//http://localhost:3000/applications/industry_alliance_unify/duo-gong-nen-ting-zu-yong/?token=JDJhJDEwJE1ESXFESWF2OGMydzRSN01YZ2tsbS5hSDVYOHprR2tUSEFlSzNMbEhGWEhMdnBvSlNPT1hP
class ContentsUnify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alias: props.match.params.alias,
      quantity: '1',
      toastTimer: null,
    };
  }

  componentDidMount() {
    this.props.fetchContentsByAlias(this.state.alias);
  }
  componentWillUnmount() {
    this.state.toastTimer && clearTimeout(this.state.toastTimer);
  }

  unify() {
    this.props.unify(this.props.match.params.alias, {
      ...this.state,
    });
  }
  delayReset() {
    this.state.toastTimer = setTimeout(() => {
      this.props.reset();
    }, 2000);
  }

  render() {
    const {
      contents: {
        contents, loading, error, just_saved,
      },
    } = this.props;
    if (just_saved) {
      this.delayReset();
    }
    return (
      <Page title="购买服务" subTitle="请确认您选择的服务的内容，以及希望购买的数量，稍后会有服务人员跟您联系" spacing history={this.props.history}>
        <Toast icon="loading" show={loading}>Loading...</Toast>
        <Toast icon="success-no-circle" show={just_saved}>保存成功</Toast>
        {
          error ? (<div className="alert alert-danger">Error: {error}</div>) : null
        }
        { contents ? (
          <Panel>
            <PanelBody>
              <MediaBox type="text">
                <MediaBoxTitle>
                  {contents.title || contents.name}
                </MediaBoxTitle>
                <MediaBoxDescription>
                  {contents.abstract}
                </MediaBoxDescription>
              </MediaBox>
            </PanelBody>
            <CellsTitle>
                单价：{contents.extensions.price}元/{contents.extensions.unit}
            </CellsTitle>
            <Form>
              <FormCell>
                <CellHeader>
                  <Label>数量</Label>
                </CellHeader>
                <CellBody>
                  <Input
                    type="number"
                    defaultValue={this.state.quantity}
                    onChange={e => this.setState({ quantity: e.target.value })}
                  />
                </CellBody>
              </FormCell>
            </Form>
            <CellsTips>计{this.state.quantity * contents.extensions.price}元</CellsTips>
            <ButtonArea>
              <Button
                disabled={!(this.state.quantity > '0') || loading}
                onClick={e => this.unify()}
              >
                  一卡通支付
              </Button>
            </ButtonArea>
          </Panel>
        ) : null
        }
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  contents: state.contents,
});

const mapDispatchToProps = dispatch => ({
  fetchContentsByAlias: id => dispatch(fetchContentsByAlias(id)),
  unify: (alias, data) => dispatch(unify(alias, data)),
  reset: () => dispatch(reset()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ContentsUnify));
