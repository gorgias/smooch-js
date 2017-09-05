import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as smooch from './../smooch';


class EmailCapture extends Component {
    _sendEmail = () => {
        smooch.updateUser({email: this.state.email});
        smooch.sendMessage(this.props.text.replace('{email}', this.state.email));
    }

    render() {
        return (
            <form
                className='gorgias-email-capture-wrapper'
                onSubmit={this._sendEmail}
            >
                <input
                    placeholder="Give us your email and we'll contact you later"
                    onChange={(e) => this.setState({email: e.target.value})}
                />
                <button onClick={this._sendEmail}>
                    <i className='fa fa-paper-plane-o'/>
                </button>
            </form>
        );
    }
}

export default connect(({ui}) => {
    return {
        text: ui.text.afterEmailCaptureText
    };
})(EmailCapture);