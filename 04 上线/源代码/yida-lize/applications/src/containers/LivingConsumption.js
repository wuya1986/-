import React, { Component } from 'react';
import { connect } from 'react-redux';

//http://localhost:3000/applications/living_consumption?token=JDJhJDEwJE1xc1ExWjc5dnhuNEpHazB5T0R5Yy41VnNZTFlOUGllbUd4dnU5SjFvQ3NuOXpaTjRSYUdP
class LivingConsumption extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>功能尚未推出</div>
    );
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(LivingConsumption);
