import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { sendMessage } from '../services/conversation';
import { update } from '../services/user';
import classnames from 'classnames';


class EmailCaptureComponent extends Component {
    static propTypes = {
        placeholder: PropTypes.string.isRequired,
        userEmail: PropTypes.string,
        isChatOnline: PropTypes.bool.isRequired,
        dispatch: PropTypes.func.isRequired
    }

    _sendEmail = (event) => {
        event.preventDefault();

        const {dispatch} = this.props;
        dispatch(update({email: this.state.email}));
        dispatch(sendMessage({
            text: this.state.email,
            metadata: {
                email_capture_answer: true
            }
        }));
    }

    constructor(props) {
        super(props);
        this.state = {
            isCompleted: !!this.props.userEmail
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.userEmail && nextProps.userEmail) {
            this.setState({isCompleted: true});
        }
    }

    render() {
        const {
            placeholder, isChatOnline,
            onlineTriggerText, onlineThanksText,
            offlineTriggerText, offlineThanksText,
            userEmail
        } = this.props;

        const {isCompleted} = this.state;

        return (
            <div className='gorgias-email-capture-wrapper'>
                <div className='gorgias-email-capture-label'>
                    <div className={classnames('completed', {
                        'displayed': isCompleted
                    })}>
                        <div className='icon-circle'>
                            <i className='fa fa-check'/>
                        </div>
                        {
                            isChatOnline
                                ? onlineThanksText.replace('{email}', userEmail)
                                : offlineThanksText.replace('{email}', userEmail)}
                    </div>
                    {!isCompleted && (isChatOnline ? onlineTriggerText : offlineTriggerText)}
                </div>
                <form
                    className={classnames('gorgias-email-capture-form', {
                        'displayed': !isCompleted
                    })}
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
            </div>
        );
    }
}

export const EmailCapture = connect(({ui, appState: {isChatOnline}}) => {
    return {
        isChatOnline: isChatOnline,
        placeholder: ui.text.emailCapturePlaceholder,
        onlineTriggerText: ui.text.emailCaptureOnlineTriggerText,
        onlineThanksText: ui.text.emailCaptureOnlineThanksText,
        offlineTriggerText: ui.text.emailCaptureOfflineTriggerText,
        offlineThanksText: ui.text.emailCaptureOfflineThanksText
    };
}, undefined, undefined, {
    withRef: true
})(EmailCaptureComponent);
