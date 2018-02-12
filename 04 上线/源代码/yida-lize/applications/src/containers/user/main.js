import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import {
  MediaBox,
  MediaBoxBody,
  MediaBoxDescription,
  MediaBoxHeader,
  MediaBoxTitle,
  MediaBoxInfo,
  MediaBoxInfoMeta,
  Page,
  Panel,
  PanelBody,
  Toast,
  Grids,
} from 'react-weui';

import constants from '../../constants/';
import Svg from '../../components/Svg';

class Main extends Component {
  render() {
    const {
      auth: {
        loading, error,
        user: {
          funcs,
        },
      },
    } = this.props;
    if (!funcs) {
      return (<div />);
    }
    const grids_data = [];
    funcs.shortcuts.map((item, i) => (
      grids_data.push({
        icon: <Svg icon_id={item.id} />,
        label: item.title,
        href: item.uri,
      })
    ));
    const settings = {
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
    };
    return (
      <div>
        <Toast icon="loading" show={loading}>Loading...</Toast>
        { error ? (
          <div>{error}</div>
        ) : null
        }
        {
          <Panel>
            <Slider {...settings}>
              {
                funcs.swipers.map((item, i) => (
                  <img style={{ height: 300 }} onClick={e => window.location.href = `${item.url}`} src={`${constants.CMS_URL}${item.thumbnail.src}`} key={i} />
                ))
              }
            </Slider>
            <PanelBody style={{ marginTop: 30 }}>
              <Grids data={grids_data} />
              {funcs.news.map((item, i) => (
                <MediaBox type="appmsg" href={`${constants.CMS_URL}/notice_news/${item.alias}`} key={i}>
                  { item.thumbnail ? (
                    <MediaBoxHeader><img src={`${constants.CMS_URL}${item.thumbnail.src}`} /></MediaBoxHeader>
                  ) : null }
                  <MediaBoxBody>
                    <MediaBoxTitle>{item.title}</MediaBoxTitle>
                    <MediaBoxDescription>
                      {item.abstract}
                    </MediaBoxDescription>
                    <MediaBoxInfo>
                      <MediaBoxInfoMeta>{item.user ? item.user.username : '跌名'}</MediaBoxInfoMeta>
                      <MediaBoxInfoMeta extra>{moment(item.date).format('YYYY-MM-DD')}</MediaBoxInfoMeta>
                    </MediaBoxInfo>
                  </MediaBoxBody>
                </MediaBox>
              ))}
            </PanelBody>
          </Panel>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
