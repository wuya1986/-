import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
  Button,
  ButtonArea,
  Cell,
  CellBody,
  CellFooter,
  CellHeader,
  Form,
  FormCell,
  Input,
  Label,
  Select,
  Toast,
} from 'react-weui';

import Page from '../components/page';
import {
  fetchEmployee,
  saveEmployee,
  resetEmployee,
} from '../actions/employees';
import constants from '../constants/';

// http://localhost:3000/applications/employees/show/3456789
class EmployeeDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toastTimer: null,
    };
  }

  componentDidMount() {
    this.props.fetchEmployee(this.props.match.params.employee_id);
  }
  componentWillUnmount() {
    this.state.toastTimer && clearTimeout(this.state.toastTimer);
  }

  saveEmployee() {
    this.props.saveEmployee(this.props.match.params.employee_id, {
      ...this.state,
    });
  }

  delayReset() {
    this.state.toastTimer = setTimeout(() => {
      this.props.resetEmployee();
    }, 2000);
  }
  avatar(avatar) {
    if (avatar) {
      if (avatar.startsWith('http')) {
        return avatar;
      }
      return `${constants.FILE_URL}/${avatar}`;
    }
    return `${constants.FILE_URL}/avatars/avatar.svg`;
  }

  render() {
    const {
      employee: {
        employee, loading, error, just_saved,
      },
    } = this.props;
    if (just_saved) {
      this.delayReset();
    }
    return (
      <Page className="cell" spacing history={this.props.history}>
        <Toast icon="loading" show={loading}>Loading...</Toast>
        <Toast icon="success-no-circle" show={just_saved}>保存成功</Toast>
        {
          error ? (<div className="alert alert-danger">Error: {error}</div>) : null
        }
        { employee ? (
          <Form>
            <FormCell>
              <CellHeader>
                <Label>头像</Label>
              </CellHeader>
              <CellBody />
              <CellFooter>
                <img src={this.avatar(employee.avatar)} style={{ width: 100, height: 100, borderRadius: 50 }} />
              </CellFooter>
            </FormCell>
            <FormCell>
              <CellHeader>
                <Label>姓名</Label>
              </CellHeader>
              <CellBody>
                <Input
                  type="text"
                  defaultValue={employee.fullname}
                  onChange={e => this.setState({
                        fullname: e.target.value,
                    })}
                />
              </CellBody>
            </FormCell>
            <FormCell>
              <CellHeader>
                <Label>电话</Label>
              </CellHeader>
              <CellBody>
                <Input
                  type="tel"
                  defaultValue={employee.mobile_no}
                  onChange={e => this.setState({
                        mobile_no: e.target.value,
                    })}
                />
              </CellBody>
            </FormCell>
            {
                employee.e_card ? (
                  <Cell>
                    <CellHeader>
                      <Label>一卡通卡号</Label>
                    </CellHeader>
                    <CellBody>
                      {employee.e_card}
                    </CellBody>
                  </Cell>
                ) : null
              }
            <FormCell select selectPos="after">
              <CellHeader>
                <Label>身份</Label>
              </CellHeader>
              <CellBody>
                <Select
                  defaultValue={employee.role}
                  onChange={e => this.setState({
                        role: e.target.value,
                    })}
                  data={[
                      {
                        value: '访客',
                        label: '访客',
                      },
                      {
                        value: '园区客户',
                        label: '园区客户',
                      },
                    ]}
                />
              </CellBody>
            </FormCell>

            <ButtonArea>
              <Button
                type="primary"
                onClick={e => this.saveEmployee()}
              >
                  保存
              </Button>
            </ButtonArea>
          </Form>
        ) : null
        }
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  employee: state.employee,
});

const mapDispatchToProps = dispatch => ({
  fetchEmployee: id => dispatch(fetchEmployee(id)),
  saveEmployee: (employee_id, employee) => dispatch(saveEmployee(employee_id, employee)),
  resetEmployee: () => dispatch(resetEmployee()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EmployeeDetail));
