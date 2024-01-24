import { useControls } from "leva";




export const Point_Light = () => {
    const {brightness2} = useControls({
      brightness2: {
        label: 'Point Light',
        value: 7,
        min: 0.1,
        max: 10000.0,
        step: 0.1
      }
    });
  
  
    return (
      <pointLight intensity={brightness2} position={[0, 0, 0]}/>
    );
  }