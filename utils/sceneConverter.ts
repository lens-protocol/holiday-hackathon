import React from 'react'

export function convertTestBeaconToString() {
  // This is a simplified version of the scene code that will be embedded
  return `
    const { Canvas } = window.ReactThreeFiber;
    const { OrbitControls } = window.drei;

    function Box() {
      const meshRef = React.useRef();

      React.useEffect(() => {
        if (!meshRef.current) return;
        meshRef.current.rotation.x = 0.5;
      }, []);

      return (
        React.createElement('mesh', { ref: meshRef },
          React.createElement('boxGeometry', { args: [1, 1, 1] }),
          React.createElement('meshStandardMaterial', { color: 'orange' })
        )
      );
    }

    function Scene() {
      return React.createElement(
        'div',
        { style: { width: '100%', height: '100vh' } },
        React.createElement(
          Canvas,
          null,
          React.createElement('ambientLight', { intensity: 0.5 }),
          React.createElement('pointLight', { position: [10, 10, 10] }),
          React.createElement(Box),
          React.createElement(OrbitControls)
        )
      );
    }

    // Mount the scene
    ReactDOM.createRoot(document.getElementById('root')).render(
      React.createElement(Scene)
    );
  `
}
