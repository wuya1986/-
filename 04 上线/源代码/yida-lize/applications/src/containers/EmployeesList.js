import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  MediaBox,
  MediaBoxBody,
  MediaBoxDescription,
  MediaBoxHeader,
  MediaBoxTitle,
  Panel,
  PanelBody,
  Toast,
} from 'react-weui';
import Page from '../components/page';

import {
  fetchEmployees,
} from '../actions/employees';

import constants from '../constants/';

// http://localhost:3000/applications/employees?token=JDJhJDEwJFRpengyMEdiemthSUk4U01kSGlnMmU1c1JmandGZTFjYVkvelVQTy5ORHJvRjQxWDRoNW9X
class EmployeesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employee: {},
    };
  }
  componentDidMount() {
    this.props.fetchEmployees();
  }

  certification(employee, certificate) {
    this.setState({
      employee: {},
    });
  }

  openCertificateDialog(employee) {
    this.props.history.push(`/applications/employees/show/${employee._id}`);
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
      employees, loading, certificating, error,
    } = this.props.employees;

    return (
      <Page className="button" spacing>
        <Toast icon="loading" show={loading || certificating}>Loading...</Toast>
        {
          error ? (<div className="alert alert-danger">Error: {error}</div>) : null
        }
        { !loading && !error ? (
          <Panel>
            <PanelBody>
              {employees.map((employee, i) => (
                <MediaBox
                  type="appmsg"
                  href="javascript:void(0);"
                  key={i}
                  onClick={() => this.openCertificateDialog(employee)}
                >
                  <MediaBoxHeader>
                    <img
                      style={{ borderRadius: 50 }}
                      src={this.avatar(employee.avatar)}
                    />
                  </MediaBoxHeader>
                  <MediaBoxBody>
                    <MediaBoxTitle>
                      {`${employee.fullname} - ${employee.mobile_no}`}
                    </MediaBoxTitle>
                    <MediaBoxDescription>
                      {`${employee.role} - ${employee.request_employee}`}
                    </MediaBoxDescription>
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
  employees: state.employees,
});

const mapDispatchToProps = dispatch => ({
  fetchEmployees: () => dispatch(fetchEmployees()),
});

export default connect(actiontateToProps, mapDispatchToProps)(EmployeesList);
