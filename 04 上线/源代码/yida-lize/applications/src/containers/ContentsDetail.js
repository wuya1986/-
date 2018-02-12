import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
  Article,
  Button,
  Panel,
  PanelBody,
  MediaBox,
  MediaBoxDescription,
  MediaBoxHeader,
  MediaBoxBody,
  MediaBoxTitle,
  MediaBoxInfo,
  MediaBoxInfoMeta,
  Toast,
} from 'react-weui';

import moment from 'moment';
import marked from 'marked';
import constants from '../constants/';

import Page from '../components/page';
import {
  fetchContentsByAlias,
} from '../actions/contents';

// http://localhost:3000/applications/contents/show/3456789
class ContentsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alias: props.match.params.alias,
    };
  }

  componentDidMount() {
    this.props.fetchContentsByAlias(this.props.match.params.alias);
  }
  comment(contents) {
    this.props.history.push(`/applications/contents/comment/${contents.alias}`);
  }
  imgsrc(content) {
    return content.replace(/img src="/g, `img src="${constants.CMS_URL}`);
  }
  unify(contents) {
    this.props.history.push(`/applications/contents/unify/${contents.alias}`);
  }

  render() {
    const {
      contents: {
        contents, loading, error,
      },
    } = this.props;
    if (!contents) {
      return (
        <Toast icon="loading" show>Loading...</Toast>
      );
    }
    return (
      <Page
        className="button"
        history={this.props.history}
      >
        <Toast icon="loading" show={loading}>Loading...</Toast>
        {
          error ? (<div className="alert alert-danger">Error: {error}</div>) : null
        }
        { contents ? (
          <Article style={{ backgroundColor: '#fff' }}>
            <h1 style={{ textAlign: 'center' }}>{contents.title}</h1>
            <section>
              <div
                className="content"
                dangerouslySetInnerHTML={{ __html: this.imgsrc(marked(contents.content)) }}
              />
            </section>
            <div className="button-sp-area">
              <Button
                type="default"
                size="small"
                onClick={() => this.comment(contents)}
              >留言
              </Button>
              {
                  (contents.extensions && contents.extensions.price) ? (
                    <Button
                      type="default"
                      size="small"
                      onClick={() => this.unify(contents)}
                    >下单
                    </Button>
                  ) : null
                }
            </div>
            {contents.comments.map((comment, i) => (
              <MediaBox
                type="appmsg"
                href="javascript:void(0);"
                key={i}
              >
                <MediaBoxHeader>
                  <img
                    style={{ borderRadius: 50 }}
                    src={comment.user.avatar}
                  />
                </MediaBoxHeader>
                <MediaBoxBody>
                  <MediaBoxTitle>
                    {comment.content}
                  </MediaBoxTitle>
                  <MediaBoxInfo>
                    <MediaBoxInfoMeta>{comment.user ? comment.user.fullname : ''}</MediaBoxInfoMeta>
                    <MediaBoxInfoMeta>{moment(comment.create_date).format('YYYY-MM-DD')}</MediaBoxInfoMeta>
                  </MediaBoxInfo>
                </MediaBoxBody>
              </MediaBox>
            ))}
          </Article>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ContentsDetail));
