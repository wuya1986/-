import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  MediaBox,
  Panel,
  PanelBody,
  PanelHeader,
  SearchBar,
  Page,
} from 'react-weui';

import CompanyItem from '../components/company-item.js';
import {
  searchCompanyByKeyword,
} from '../actions/contents';

//http://localhost:3000/applications/industry_map
class IndustryMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    };
  }

  componentDidMount() {
  }

  handleChange(text, e) {
    if (text.length > 1) {
      this.props.searchCompanyByKeyword(text);
    }
    this.setState({
      searchText: text,
    });
  }

  render() {
    const {
      companies: {
        companies, loading, error,
      },
    } = this.props;
    return (
      <Page className="searchbar" title="SearchBar" subTitle="搜索栏">
        <Panel>
          <PanelHeader>
            企业搜索
          </PanelHeader>
          <SearchBar
            onChange={this.handleChange.bind(this)}
            defaultValue={this.state.searchText}
            placeholder="请输入企业或者产品的关键字"
            lang={{
              cancel: '取消',
            }}
          />

          <PanelBody style={{ display: this.state.searchText.length > 1 ? null : 'none', marginTop: 0 }}>
            {
              companies.length > 0 ?
              companies.map((company, i) => (
                <CompanyItem
                  key={i}
                  company={company}
                  linkto={`/applications/contents/show/${company.alias}`}
                />
              ))
              : <MediaBox>没有找到相关企业！</MediaBox>
            }
          </PanelBody>
        </Panel>
      </Page>
    );
  }
}


const mapStateToProps = state => ({
  companies: state.companies,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  searchCompanyByKeyword: keyword => dispatch(searchCompanyByKeyword(keyword)),
});

export default connect(mapStateToProps, mapDispatchToProps)(IndustryMap);
