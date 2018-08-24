// This file contains the boilerplate to execute your React app.
// If you want to modify your application's content, start in "index.js"

import {ReactInstance} from 'react-360-web';

function init(bundle, parent, options = {}) {
  const r360 = new ReactInstance(bundle, parent, {
    // Add custom options here
    fullScreen: true,
    ...options,
  });
console.log(r360)
  // Render your app content to the default cylinder surface
  r360.renderToLocation(
    r360.createRoot('TemplateTour'),
    r360.getDefaultLocation(),
  );
}

window.React360 = {init};
