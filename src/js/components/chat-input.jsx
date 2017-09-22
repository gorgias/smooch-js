import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import isMobile from 'ismobilejs';
import bindAll from 'lodash.bindall';

import { sendMessage, resetUnreadCount } from '../services/conversation';

import { ImageUpload } from './image-upload';



export class ChatInputComponent extends Component {

    static propTypes = {
        accentColor: PropTypes.string,
        imageUploadEnabled: PropTypes.bool.isRequired,
        inputPlaceholderText: PropTypes.string.isRequired,
        unreadCount: PropTypes.number.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    state = {
        text: ''
    };

    constructor(...args) {
        super(...args);
        bindAll(this,
            'blur',
            'checkAndResetUnreadCount',
            'onChange',
            'onFocus',
            'onSendMessage'
        );
    }

    blur() {
        this.refs.input.blur();
    }

    checkAndResetUnreadCount(unreadCount) {
        const {dispatch} = this.props;
        if (unreadCount > 0) {
            dispatch(resetUnreadCount());
        }
    }

    onChange(e) {
        this.checkAndResetUnreadCount(this.props.unreadCount);
        this.setState({
            text: e.target.value
        });
    }

    onFocus() {
        this.checkAndResetUnreadCount(this.props.unreadCount);
    }

    onKeyPress = (e) => {
        if (e.nativeEvent.keyCode === 13 && !e.nativeEvent.shiftKey) {
            this.onSendMessage(e);
        }
    }

    onSendMessage(e) {
        e.preventDefault();
        const {text} = this.state;
        const {dispatch} = this.props;
        if (text.trim()) {
            this.setState({
                text: ''
            });
            dispatch(sendMessage(text));
            this.refs.input.focus();
        }
    }

    render() {
        const {accentColor, imageUploadEnabled, inputPlaceholderText} = this.props;

        let sendButton;

        const buttonClassNames = ['send'];
        const buttonStyle = {};

        if (this.state.text.trim()) {
            buttonClassNames.push('active');
        }

        if (isMobile.apple.device) {
            // Safari on iOS needs a way to send on click, without triggering a mouse event.
            // onTouchStart will do the trick and the input won't lose focus.
            sendButton = (
                <span ref='button'
                      className={buttonClassNames.join(' ')}
                      onTouchStart={this.onSendMessage}
                      style={buttonStyle}>
                    <i className='fa fa-paper-plane'/>
                </span>
            );
        } else {
            sendButton = (
                <a
                    ref='button'
                    className={ buttonClassNames.join(' ') }
                    onClick={ this.onSendMessage }
                    style={ buttonStyle }
                >
                    <i className='fa fa-paper-plane'/>
                </a>
            );
        }

        const imageUploadButton = imageUploadEnabled ?
            <ImageUpload ref='imageUpload'
                         color={ accentColor } /> : null;

        const inputContainerClasses = ['input-container'];

        if (!imageUploadEnabled) {
            inputContainerClasses.push('no-upload');
        }

        return (
            <div id='sk-footer'>
                <div className='input-wrapper'>
                    <form onSubmit={this.onSendMessage}
                          action='#'>
                        <div className={inputContainerClasses.join(' ')}>
                            <pre className='bg-input'>
                                {this.state.text + '\n'}
                            </pre>
                            <textarea
                                ref='input'
                                placeholder={inputPlaceholderText}
                                className='input message-input'
                                onChange={this.onChange}
                                onFocus={this.onFocus}
                                onKeyPress={this.onKeyPress}
                                value={this.state.text}
                                rows='1'
                            />
                        </div>
                    </form>
                    {!this.state.text && imageUploadButton}
                    {this.state.text && sendButton}
                </div>
            </div>
        );
    }
}

export const ChatInput = connect(({appState, app, ui, conversation: {unreadCount}}) => {
    return {
        imageUploadEnabled: appState.imageUploadEnabled,
        accentColor: app.settings.web.accentColor,
        inputPlaceholderText: ui.text.inputPlaceholder,
        unreadCount
    };
}, undefined, undefined, {
    withRef: true
})(ChatInputComponent);
