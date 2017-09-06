import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import * as webMessenger from './../web-messenger';


class EmailCapture extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired
    }

    _sendEmail = () => {
        webMessenger.updateUser({email: this.state.email});
        webMessenger.sendMessage(this.props.text.replace('{email}', this.state.email));
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