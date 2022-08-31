import React from 'react';
import classes from './MyInput.module.css'

// const MyInput = React.forwardRef((props, ref) => {
//   return (
//     <input ref={ref} className={classes.MyInput} {...props}/>
//   );
// }); // Для способа с хуком useRef

const MyInput = (props) => {
  return (
    <input className={classes.MyInput} {...props} />
  );
};

export default MyInput;