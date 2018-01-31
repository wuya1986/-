import React from 'react';
import * as FontAwesome from 'react-icons/lib/fa'

import {
  Footer,
  FooterLink,
  FooterLinks,
  MediaBox,
  Panel,
  PanelBody,
  MediaBoxHeader,
  MediaBoxBody,
  MediaBoxTitle,
  MediaBoxDescription,
} from 'react-weui';

export default class Page extends React.Component {
  render() {
    const {
      title, subTitle, spacing, className, children, history, ticket_indicates,
    } = this.props;

    return (
      <section className={`page ${className}`}>
        <div className="page__hd">
          <h1 className="page__title">{title}</h1>
          <p className="page__desc">{subTitle}</p>
        </div>
        { ticket_indicates ? (
          <Panel>
            <PanelBody>
              { 
                (ticket_indicates.length > 0) ? (
                  ticket_indicates.map((ticket_indicate, i) => (
                    <MediaBox type="appmsg" href="javascript:void(0);" style={{padding:0}} key={i}>
                      <MediaBoxHeader style={{width: 30, height:30, lineHeight: 2, margin: 5}}>
                        { (ticket_indicate.progress_over) ? (
                          <FontAwesome.FaCheckCircle size={20} color='#ff851b'/>
                        ) : (
                          <FontAwesome.FaCheckCircle size={20} color='#d2d6de'/>
                        )}
                      </MediaBoxHeader>
                      <MediaBoxBody>
                        <MediaBoxTitle style={{fontSize: 14, margin:0}}>{ticket_indicate.header}</MediaBoxTitle>
                        <MediaBoxDescription style={{fontSize: 12, margin:0}}>
                          {ticket_indicate.body}
                        </MediaBoxDescription>
                      </MediaBoxBody>
                    </MediaBox>
                  ))
                ) : (
                  <div />
                )
              }
            </PanelBody>
          </Panel>
        ) : null
        }
        <div className={`page__bd ${spacing ? 'page__bd_spacing' : ''}`}>
          {children}
        </div>
        {
          (this.props.history && this.props.history.length > 1) ? (
            <Footer>
              <FooterLinks>
                <FooterLink
                  onClick={e => this.props.history.goBack()}
                >后退
                </FooterLink>
              </FooterLinks>
            </Footer>
          ) : false
        }
      </section>
    );
  }
}
