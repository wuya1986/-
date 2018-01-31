import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compact, uniq, map } from 'lodash';

import {
  Flex,
  FlexItem,
  Button,
  MediaBox,
  MediaBoxBody,
  MediaBoxDescription,
  MediaBoxHeader,
  MediaBoxInfo,
  MediaBoxInfoMeta,
  MediaBoxTitle,
  Panel,
  PanelBody,
  Toast,
} from 'react-weui';
import Page from '../components/page';

import {
  listContentsByPath,
} from '../actions/contents';

import constants from '../constants/';

// http://localhost:3000/applications/contents/list/industry_alliance?token=JDJhJDEwJDBLN01mY0Y5RlFhQW1maS9xMi80cnVLVEdEcXlpcWlYVHZvN0wyNEdSelFPbGlLMG1JcUFl
class ContentsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: null,
    };
  }
  componentDidMount() {
    this.props.listContentsByPath(this.props.match.params.path);
  }

  openContents(contents) {
    this.props.history.push(`/applications/contents/show/${contents.alias}`);
  }

  render() {
    const {
      list, loading, error,
    } = this.props.contents_list;

    const filters = compact(uniq(map(list, 'extensions.category')));
    return (
      <Page className="button" spacing>
        {
        filters.length > 0 ? (
          <div className="button-sp-area">
            {
              filters.map((filter, i) => (
                <Button
                  key={i}
                  type={this.state.filter === filter ? 'primary' : 'default'}
                  size="small"
                  onClick={e => this.setState({ filter })}
                >{filter}
                </Button>
              ))
            }
          </div>
        ) : null
      }
        <Toast icon="loading" show={loading}>Loading...</Toast>
        {
          error ? (<div className="alert alert-danger">Error: {error}</div>) : null
        }
        { !loading && !error ? (
          <Panel>
            <PanelBody>
              {list.filter(contents => (!this.state.filter || (contents.extensions && contents.extensions.category === this.state.filter)))
                     .map((contents, i) => (
                       <MediaBox
                         type="appmsg"
                         href="javascript:void(0);"
                         key={i}
                         onClick={() => this.openContents(contents)}
                       >
                         <MediaBoxHeader>
                           <img
                             src={contents.thumbnail ? `${constants.CMS_URL}${contents.thumbnail.src}` : `${constants.FILE_URL}/avatars/avatar.svg`}
                           />
                         </MediaBoxHeader>
                         <MediaBoxBody>
                           <MediaBoxTitle>
                             {`${contents.title}`}
                           </MediaBoxTitle>
                           <MediaBoxDescription>
                             {`${contents.abstract}`}
                           </MediaBoxDescription>
                           <div>
                             <MediaBoxInfo>
                               <MediaBoxInfoMeta>
                                 {contents.extensions ? contents.extensions.category : ''}
                               </MediaBoxInfoMeta>
                             </MediaBoxInfo>
                           </div>
                         </MediaBoxBody>
                       </MediaBox>
                     ))}
            </PanelBody>
          </Panel>
        ) : null}
      </Page>
    );
  }
}

const actiontateToProps = state => ({
  contents_list: state.contents_list,
});

const mapDispatchToProps = dispatch => ({
  listContentsByPath: path => dispatch(listContentsByPath(path)),
});

export default connect(actiontateToProps, mapDispatchToProps)(withRouter(ContentsList));
