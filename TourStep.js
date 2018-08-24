import React from 'react';
import {AppRegistry, asset, Image, Pano, Text, Sound, View} from 'react-360';

import InfoButton from './InfoButton';
import NavButton from './NavButton';
import LoadingSpinner from './LoadingSpinner';

import CylindricalPanel from 'CylindricalPanel';
import connectToStores from './connectToStores';
import TourStore from "./stores/tourStore";
import TourActions from "./actions/tourActions";

import config from './tour_config/config.json';



// Web VR is only able to support a maxiumum texture resolution of 4096 px
const MAX_TEXTURE_WIDTH = 4096;
const MAX_TEXTURE_HEIGHT = 720;
// Cylinder is a 2D surface a fixed distance from the camera.
// It uses pixes instead of meters for positioning components.
// pixels = degrees/360 * density, negative to rotate in expected direction.
const degreesToPixels = degrees => -(degrees / 360) * MAX_TEXTURE_WIDTH;
// PPM = 1/(2*PI*Radius) * density. Radius of cylinder is 3 meters.
const PPM = 1 / (2 * Math.PI * 3) * MAX_TEXTURE_WIDTH;

/**
 * ReactVR component that allows a simple tour using linked 360 photos.
 * Tour includes nav buttons, activated by gaze-and-fill or direct selection,
 * that move between tour locations and info buttons that display tooltips with
 * text and/or images. Tooltip data and photo URLs are read from a JSON file.
 */

 const storeConnector = {
   TourStore(Store) {
     return {
       stepData: Store.getStepData(),
       isLoading: Store.isFetching(),
     };
   }
 };

class TourStep extends React.Component {
  render() {
    if (!this.props.stepData) {
      return null;
    }

    const photoData = this.props.stepData;
    const tooltips = (photoData && photoData.tooltips) || null;
    const rotation =
      config.firstStepRotation + ((photoData && photoData.rotationOffset) || 0);
    const isLoading = this.props.isLoading;
    const soundEffects = photoData.soundEffects;
    const ambient = null; //photoData.soundEffects.ambient;

    return (
      <View>
        <View style={{transform: [{rotateY: rotation}]}}>
          {ambient &&
            <Sound
              // Background audio that plays throughout the tour.
              source={asset(ambient.uri)}
              autoPlay={true}
              loop={ambient.loop}
              volume={ambient.volume}
            />}
          <Pano
            // Place pano in world, and by using position absolute it does not
            // contribute to the layout of other views.
            style={{
              position: 'absolute',
              tintColor: isLoading ? 'grey' : 'white',
            }}
            /*onLoad={() => {
              const data = this.state.data;
              this.setState({
                // Now that ths new photo is loaded, update the locationId.
                locationId: this.state.nextLocationId,
              });
            }}*/
            source={asset(photoData.uri)}
          />
          <CylindricalPanel
            layer={{
              width: MAX_TEXTURE_WIDTH,
              height: MAX_TEXTURE_HEIGHT,
              density: MAX_TEXTURE_WIDTH,
            }}
            style={{position: 'absolute'}}>
            <View
              style={{
                // View covering the cyldiner. Center so contents appear in middle of cylinder.
                alignItems: 'center',
                justifyContent: 'center',
                width: MAX_TEXTURE_WIDTH,
                height: MAX_TEXTURE_HEIGHT,
              }}>
              {/* Need container view, else using absolute position on buttons removes them from cylinder */}
              <View>
                {tooltips &&
                  tooltips.map((tooltip, index) => {
                    // Iterate through items related to this location, creating either
                    // info buttons, which show tooltip on hover, or nav buttons, which
                    // change the current location in the tour.
                    if (tooltip.type) {
                      return (
                        <InfoButton
                          key={index}
                          //onEnterSound={asset(soundEffects.navButton.onEnter.uri)}
                          pixelsPerMeter={PPM}
                          source={asset('info_icon.png')}
                          tooltip={tooltip}
                          translateX={tooltip.translateX}
                          translateY={tooltip.translateY}
                        />
                      );
                    }
                    return (
                      <NavButton
                        key={tooltip.linkedPhotoId}
                        isLoading={isLoading}
                        //onClickSound={asset(soundEffects.navButton.onClick.uri)}
                        //onEnterSound={asset(soundEffects.navButton.onEnter.uri)}
                        onInput={() => {
                          TourActions.navigateTo(tooltip.linkedPhotoId);
                        }}
                        pixelsPerMeter={PPM}
                        source={asset('chester_icon.png')}
                        textLabel={tooltip.text}
                        translateX={tooltip.translateX}
                        translateY={tooltip.translateY}
                      />
                    );
                  })}
                {/*{locationId == null &&
                  // Show a spinner while first pano is loading.
                  <LoadingSpinner
                    style={{layoutOrigin: [0.5, 0.5]}}
                    pixelsPerMeter={PPM}
                    // Undo the rotation so spinner is centered
                    translateX={degreesToPixels(rotation) * -1}
                  />}*/}
              </View>
            </View>
          </CylindricalPanel>
        </View>
      </View>
    );
  }
}

const TourStepWithStore = connectToStores(
  TourStep, [TourStore], storeConnector
);

AppRegistry.registerComponent('TourStep', () => TourStepWithStore);
module.exports = TourStepWithStore;
