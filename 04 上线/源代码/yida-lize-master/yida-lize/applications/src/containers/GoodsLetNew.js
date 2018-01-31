import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  withRouter,
} from 'react-router-dom';

import {
  Button,
  ButtonArea,
  CellBody,
  CellFooter,
  CellHeader,
  CellsTitle,
  Checkbox,
  Form,
  FormCell,
  Input,
  Label,
  Msg,
  Toast,
} from 'react-weui';

import Page from '../components/page';
import { tokenLogin } from '../actions/auth';
import { fetchTicketTemplate, addTicket, resetTicket } from '../actions/tickets';

class GoodsLetNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket_template: props.match.params.goods_let_type,
      goods_let_company: '',
      goods_let_date: '',
      goods_let_company_name: '',
      goods_let_floor: '',
      goods_let_number: '',
      goods_let_applicant: '',
      goods_let_applicant_appertain: '',
      goods_let_type: props.match.params.goods_let_type == 'goods_letin' ? '搬入' : '搬出',
      goods_let_unloading_channel: '否',
      goods_let_cement: '',
      goods_let_board: '',
      goods_let_metal: '',
      goods_let_desk: '',
      goods_let_wood: '',
      goods_let_computer: '',
      goods_let_projector: '',
      goods_let_tv: '',
      goods_let_fan: '',
      goods_let_seal: '',
      goods_let_vegetation: '',
      goods_let_water: '',
      toastTimer: null,
    };
  }
  componentDidMount() {
    if (!this.props.auth.user || !this.props.auth.user.mobile_no) {
      const token = localStorage.getItem('g_token');
      this.props.tokenLogin({
        token,
      });
    }

    this.props.fetchTicketTemplate(this.state.ticket_template);
  }

  componentWillUnmount() {
    this.props.resetTicket();
    this.state.toastTimer && clearTimeout(this.state.toastTimer);
  }

  delayReset() {
    const history = this.props.history;
    this.state.toastTimer = setTimeout(() => {
      // back
      history.goBack();
    }, 2000);
  }

  addTicket() {
    this.props.addTicket({
      form_data: {
        ...this.state,
      },
      company: this.props.auth.user.company,
      content: `${this.props.auth.user.company.company_name}物品${this.state.goods_let_type}`,
      ticket_template: this.state.ticket_template,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { auth } = nextProps;
    if (auth && auth.user && auth.user.company && !this.state.goods_let_company) {
      this.setState({
        goods_let_company: auth.user.company._id,
        goods_let_company_name: auth.user.company.company_name,
        goods_let_floor: auth.user.company.floor,
        goods_let_number: auth.user.company.number,
        goods_let_applicant: auth.user.fullname,
      }, function () {
        this.forceUpdate();
      });
    }
    return true;
  }

  render() {
    const {
      auth,
      ticket_template: {
        ticket_template, loading,
      },
      tickets: {
        adding, error, added,
      },
    } = this.props;
    if (added) {
      this.delayReset();
    }
    if (added && !this.state.showToast) {
      return (
        <Page className="msg_success" history={this.props.history}>
          <Msg
            type="success"
            title="申请完成"
            description="申请完成,稍后我们的工作人员会进行确认"
          />
        </Page>
      );
    }
    return (
      <Page className="input" spacing history={this.props.history}>
        <Toast icon="warn" show={error}>{error}</Toast>
        <Toast icon="loading" show={adding || loading}>Loading...</Toast>
        <CellsTitle dangerouslySetInnerHTML={{ __html: ticket_template.user_guide }} />
        <Form>
          <FormCell>
            <CellHeader>
              <Label>租户名称</Label>
            </CellHeader>
            <CellBody>
              <Input
                type="text"
                value={this.state.goods_let_company_name}
                onChange={e => this.setState({ goods_let_company_name: e.target.value })}
              />
            </CellBody>
          </FormCell>
          <FormCell vcode>
            <CellHeader>
              <Label>租用位置</Label>
            </CellHeader>
            <CellBody>
              <Input
                type="number"
                value={this.state.goods_let_floor}
                onChange={e => this.setState({ goods_let_floor: e.target.value })}
              />
            </CellBody>
            <CellFooter>
              <Button type="vcode">层</Button>
            </CellFooter>
            <CellBody>
              <Input
                type="number"
                value={this.state.goods_let_number}
                onChange={e => this.setState({ goods_let_number: e.target.value })}
              />
            </CellBody>
            <CellFooter>
              <Button type="vcode">号</Button>
            </CellFooter>
          </FormCell>
          <FormCell>
            <CellHeader>
              <Label>申请类别</Label>
            </CellHeader>
            <CellBody>
              <Label>{this.state.goods_let_type}</Label>
            </CellBody>
          </FormCell>
          <FormCell>
            <CellHeader>
              <Label>申请人</Label>
            </CellHeader>
            <CellBody>
              <Input
                type="text"
                value={this.state.goods_let_applicant}
                onChange={e => this.setState({ goods_let_applicant: e.target.value })}
              />
            </CellBody>
          </FormCell>
          <FormCell>
            <CellHeader>
              <Label>申请人职务或申请人与租户关系</Label>
            </CellHeader>
            <CellBody>
              <Input
                type="text"
                onChange={e => this.setState({ goods_let_applicant_appertain: e.target.value })}
              />
            </CellBody>
          </FormCell>
          <FormCell>
            <CellHeader>
              <Label>出入日期</Label>
            </CellHeader>
            <CellBody>
              <Input
                type="date"
                onChange={e => this.setState({ goods_let_date: e.target.value })}
              />
            </CellBody>
          </FormCell>
        </Form>
        <Form checkbox>
          <FormCell checkbox>
            <CellHeader>
              <Checkbox
                name="goods_let_unloading_channel"
                value="是"
                onChange={e => this.setState({ goods_let_unloading_channel: e.target.value })}
              />
            </CellHeader>
            <CellBody>是否使用卸货通道</CellBody>
          </FormCell>
        </Form>
        <CellsTitle>装修材料类</CellsTitle>
        <Form>
          <FormCell vcode>
            <CellHeader>
              <Label>水泥</Label>
            </CellHeader>
            <CellBody>
              <Input type="number" onChange={e => this.setState({ goods_let_cement: e.target.value })} />
            </CellBody>
            <CellFooter>
              <Button type="vcode">袋</Button>
            </CellFooter>
          </FormCell>
          <FormCell vcode>
            <CellHeader>
              <Label>木板</Label>
            </CellHeader>
            <CellBody>
              <Input type="number" onChange={e => this.setState({ goods_let_board: e.target.value })} />
            </CellBody>
            <CellFooter>
              <Button type="vcode">件</Button>
            </CellFooter>
          </FormCell>
          <FormCell vcode>
            <CellHeader>
              <Label>金属制品</Label>
            </CellHeader>
            <CellBody>
              <Input type="number" onChange={e => this.setState({ goods_let_metal: e.target.value })} />
            </CellBody>
            <CellFooter>
              <Button type="vcode">件</Button>
            </CellFooter>
          </FormCell>
        </Form>
        <CellsTitle>办公家具类</CellsTitle>
        <Form>
          <FormCell vcode>
            <CellHeader>
              <Label>桌椅</Label>
            </CellHeader>
            <CellBody>
              <Input type="number" onChange={e => this.setState({ goods_let_desk: e.target.value })} />
            </CellBody>
            <CellFooter>
              <Button type="vcode">件</Button>
            </CellFooter>
          </FormCell>
          <FormCell vcode>
            <CellHeader>
              <Label>木制成品</Label>
            </CellHeader>
            <CellBody>
              <Input type="number" onChange={e => this.setState({ goods_let_wood: e.target.value })} />
            </CellBody>
            <CellFooter>
              <Button type="vcode">件</Button>
            </CellFooter>
          </FormCell>
        </Form>
        <CellsTitle>办公电器类</CellsTitle>
        <Form>
          <FormCell vcode>
            <CellHeader>
              <Label>台式机</Label>
            </CellHeader>
            <CellBody>
              <Input type="number" onChange={e => this.setState({ goods_let_computer: e.target.value })} />
            </CellBody>
            <CellFooter>
              <Button type="vcode">台</Button>
            </CellFooter>
          </FormCell>
          <FormCell vcode>
            <CellHeader>
              <Label>投影仪</Label>
            </CellHeader>
            <CellBody>
              <Input type="number" onChange={e => this.setState({ goods_let_projector: e.target.value })} />
            </CellBody>
            <CellFooter>
              <Button type="vcode">台</Button>
            </CellFooter>
          </FormCell>
          <FormCell vcode>
            <CellHeader>
              <Label>电视/视频会议设备</Label>
            </CellHeader>
            <CellBody>
              <Input type="number" onChange={e => this.setState({ goods_let_tv: e.target.value })} />
            </CellBody>
            <CellFooter>
              <Button type="vcode">台</Button>
            </CellFooter>
          </FormCell>
          <FormCell vcode>
            <CellHeader>
              <Label>电扇/冷风扇</Label>
            </CellHeader>
            <CellBody>
              <Input type="number" onChange={e => this.setState({ goods_let_fan: e.target.value })} />
            </CellBody>
            <CellFooter>
              <Button type="vcode">台</Button>
            </CellFooter>
          </FormCell>
        </Form>
        <CellsTitle>其他类</CellsTitle>
        <Form>
          <FormCell vcode>
            <CellHeader>
              <Label>封箱不可拆物品</Label>
            </CellHeader>
            <CellBody>
              <Input type="number" onChange={e => this.setState({ goods_let_seal: e.target.value })} />
            </CellBody>
            <CellFooter>
              <Button type="vcode">件</Button>
            </CellFooter>
          </FormCell>
          <FormCell vcode>
            <CellHeader>
              <Label>大型绿植</Label>
            </CellHeader>
            <CellBody>
              <Input type="number" onChange={e => this.setState({ goods_let_vegetation: e.target.value })} />
            </CellBody>
            <CellFooter>
              <Button type="vcode">盆</Button>
            </CellFooter>
          </FormCell>
          <FormCell vcode>
            <CellHeader>
              <Label>饮用水等</Label>
            </CellHeader>
            <CellBody>
              <Input type="number" onChange={e => this.setState({ goods_let_water: e.target.value })} />
            </CellBody>
            <CellFooter>
              <Button type="vcode">件</Button>
            </CellFooter>
          </FormCell>
        </Form>
        <ButtonArea>
          <Button
            disabled={!(this.state.goods_let_date && this.state.goods_let_company_name && this.state.goods_let_applicant) || adding}
            onClick={e => this.addTicket()}
          >
            提交申请
          </Button>
        </ButtonArea>
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  tickets: state.tickets,
  ticket_template: state.ticket_template,
});

const mapDispatchToProps = dispatch => ({
  tokenLogin: info => dispatch(tokenLogin(info)),
  addTicket: data => dispatch(addTicket(data)),
  fetchTicketTemplate: id => dispatch(fetchTicketTemplate(id)),
  resetTicket: () => dispatch(resetTicket()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GoodsLetNew));
