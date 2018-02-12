import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  MediaBox,
  MediaBoxDescription,
  MediaBoxTitle,
  Panel,
  PanelBody,
  Toast,
} from 'react-weui';

import Page from '../components/page';
import {
  fetchBuildings,
} from '../actions/buildings';

//http://localhost:3000/applications/geolocation?token=JDJhJDEwJE1xc1ExWjc5dnhuNEpHazB5T0R5Yy41VnNZTFlOUGllbUd4dnU5SjFvQ3NuOXpaTjRSYUdP
class BuildingsList extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.fetchBuildings();
  }

  postMessage(building) {
    window.postMessage(JSON.stringify({
      key: 'geolocation',
      value: building.loc,
    }));
  }

  render() {
    const { buildings, loading, error } = this.props.buildings;

    return (
      <Page className="button" spacing>
        <Toast icon="loading" show={loading}>Loading...</Toast>
        {
          error ? (<div className="alert alert-danger">Error: {error}</div>) : null
        }
        { !loading && !error ? (

          <Panel>
            <PanelBody>
              {buildings.map((building, i) => (
                <MediaBox
                  type="text"
                  key={i}
                  onClick={() => this.postMessage(building)}
                >
                  <MediaBoxTitle>{building.building_name}</MediaBoxTitle>
                  <MediaBoxDescription>
                    {building.building_address}
                  </MediaBoxDescription>
                </MediaBox>
                ))}
            </PanelBody>
          </Panel>
        ) : null}
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  buildings: state.buildings,
});

const mapDispatchToProps = dispatch => ({
  fetchBuildings: () => dispatch(fetchBuildings()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BuildingsList);
