import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
  Button,
  ButtonArea,
  CellBody,
  Form,
  FormCell,
  MediaBox,
  MediaBoxDescription,
  MediaBoxTitle,
  Panel,
  PanelBody,
  Toast,
  TextArea,
} from 'react-weui';

import Page from '../components/page';
import {
  fetchContentsByAlias,
  comment,
  reset,
} from '../actions/contents';

//http://localhost:3000/applications/industry_alliance_comment/duo-gong-nen-ting-zu-yong/?token=JDJhJDEwJE1ESXFESWF2OGMydzRSN01YZ2tsbS5hSDVYOHprR2tUSEFlSzNMbEhGWEhMdnBvSlNPT1hP
class ContentsComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alias: props.match.params.alias,
      comment: '',
      toastTimer: null,
    };
  }

  componentDidMount() {
    this.props.fetchContentsByAlias(this.props.match.params.alias);
  }
  componentWillUnmount() {
    this.state.toastTimer && clearTimeout(this.state.toastTimer);
  }

  comment() {
    this.props.comment(this.props.match.params.alias, {
      ...this.state,
    });
  }

  delayReset() {
    this.state.toastTimer = setTimeout(() => {
      this.props.reset();
      this.props.history.goBack();
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
      <Page
        title="留言"
        subTitle="请确认填写留言内容，稍后会有服务人员跟您联系"
        spacing
        history={this.props.history}
      >
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
            <Form>
              <FormCell>
                <CellBody>
                  <TextArea
                    placeholder="留言"
                    rows="3"
                    maxLength={200}
                    onChange={e => this.setState({
                          comment: e.target.value,
                      })}
                  />
                </CellBody>
              </FormCell>
            </Form>
            <ButtonArea>
              <Button
                disabled={this.state.comment === '' || loading}
                onClick={e => this.comment()}
              >
                  提交
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
  fetchContentsByAlias: alias => dispatch(fetchContentsByAlias(alias)),
  comment: (alias, data) => dispatch(comment(alias, data)),
  reset: () => dispatch(reset()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ContentsComment));
