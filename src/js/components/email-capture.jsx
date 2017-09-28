import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { sendMessage } from '../services/conversation';
import { update } from '../services/user';


class EmailCaptureComponent extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        placeholder: PropTypes.string.isRequired,
        dispatch: PropTypes.func.isRequired
    }

    _sendEmail = () => {
        const {dispatch} = this.props;
        dispatch(update({email: this.state.email}));
        dispatch(sendMessage({
            text: this.props.text.replace('{email}', this.state.email),
            metadata: {
                type: 'gorgias-email-capture-thanks-trigger'
            }
        }));
    }

    render() {
        const {placeholder} = this.props;

        return (
            <form
                className='gorgias-email-capture-wrapper'
                onSubmit={this._sendEmail}
            >
                <input
                    placeholder={placeholder}
                    onChange={(e) => this.setState({email: e.target.value})}
                />
                <button onClick={this._sendEmail}>
                    <i className='fa fa-paper-plane-o'/>
                </button>
            </form>
        );
    }
}

export const EmailCapture = connect(({ui}) => {
    return {
        text: ui.text.afterEmailCaptureText,
        placeholder: ui.text.emailCapturePlaceholder
    };
}, undefined, undefined, {
    withRef: true
})(EmailCaptureComponent);
