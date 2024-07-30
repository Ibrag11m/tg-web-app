import React from 'react';
const Button = (props) => {
    return (
        <button {...porps} className={'button' + props.className}/>
    );
};
export default Button;