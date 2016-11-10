'use strict';

exports.__esModule = true;
exports.MessageComponent = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _textMessage = require('./text-message');

var _imageMessage = require('./image-message');

var _action = require('./action');

var _reactDom = require('react-dom');

var _dom = require('../utils/dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MessageComponent = exports.MessageComponent = function (_Component) {
    (0, _inherits3.default)(MessageComponent, _Component);

    function MessageComponent() {
        (0, _classCallCheck3.default)(this, MessageComponent);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    MessageComponent.prototype.componentDidMount = function componentDidMount() {
        if (this.props.actions.length === 0) {
            this._restyleBubble();
        }
    };

    MessageComponent.prototype._restyleBubble = function _restyleBubble() {
        var bubble = (0, _reactDom.findDOMNode)(this.refs.messageContent);
        if (bubble) {
            var messageElement = bubble.firstChild;
            var messageProperties = (0, _dom.getElementProperties)(messageElement);
            var bubbleProperties = (0, _dom.getElementProperties)(bubble);
            var multiLineCheck = parseInt(bubbleProperties.fontSize) * 2;
            if (messageProperties.height > multiLineCheck && messageProperties.width < bubbleProperties.width) {
                bubble.style.width = messageProperties.width + parseInt(bubbleProperties.paddingLeft) + parseInt(bubbleProperties.paddingRight) + 'px';
            }
        }
    };

    MessageComponent.prototype.render = function render() {
        var _props = this.props,
            name = _props.name,
            role = _props.role,
            mediaUrl = _props.mediaUrl,
            avatarUrl = _props.avatarUrl,
            text = _props.text,
            accentColor = _props.accentColor,
            firstInGroup = _props.firstInGroup,
            lastInGroup = _props.lastInGroup,
            linkColor = _props.linkColor;

        var actions = this.props.actions.filter(function (a) {
            return a.type !== 'reply';
        });
        var hasQuickReplies = this.props.actions.length !== actions.length;

        var actionList = actions.map(function (action) {
            return _react2.default.createElement(_action.Action, (0, _extends3.default)({ key: action._id,
                buttonColor: linkColor
            }, action));
        });

        var isAppUser = role === 'appUser';

        var avatarClass = mediaUrl ? ['sk-msg-avatar', 'sk-msg-avatar-img'] : ['sk-msg-avatar'];

        var avatar = isAppUser ? null : _react2.default.createElement('img', { className: avatarClass.join(' '),
            src: avatarUrl });

        var avatarPlaceHolder = isAppUser ? null : _react2.default.createElement('div', { className: 'sk-msg-avatar-placeholder' });

        var message = mediaUrl ? _react2.default.createElement(_imageMessage.ImageMessage, (0, _extends3.default)({}, this.props, {
            actions: actions })) : _react2.default.createElement(_textMessage.TextMessage, (0, _extends3.default)({}, this.props, {
            actions: actions }));

        var containerClass = [mediaUrl ? 'sk-msg-image' : 'sk-msg'];

        var hasContent = text && text.trim() || mediaUrl && mediaUrl.trim();

        if (hasContent && actions.length > 0) {
            containerClass.push('has-actions');
        }

        var style = {};

        if (!mediaUrl) {
            if (isAppUser && accentColor) {
                style.backgroundColor = style.borderLeftColor = '#' + accentColor;
            }
        }

        if (hasQuickReplies) {
            containerClass.push('sk-msg-has-quick-replies');
        }

        if (firstInGroup && !lastInGroup) {
            if (isAppUser) {
                containerClass.push('sk-msg-appuser-first');
            } else {
                containerClass.push('sk-msg-appmaker-first');
            }
        }

        if (lastInGroup && !firstInGroup) {
            if (isAppUser) {
                containerClass.push('sk-msg-appuser-last');
            } else {
                containerClass.push('sk-msg-appmaker-last');
            }
        }

        if (!firstInGroup && !lastInGroup) {
            if (isAppUser) {
                containerClass.push('sk-msg-appuser-middle');
            } else {
                containerClass.push('sk-msg-appmaker-middle');
            }
        }

        var fromName = _react2.default.createElement(
            'div',
            { className: 'sk-from' },
            isAppUser ? '' : name
        );

        return _react2.default.createElement(
            'div',
            { className: 'sk-row ' + (isAppUser ? 'sk-right-row' : 'sk-left-row') },
            !isAppUser && firstInGroup ? fromName : '',
            lastInGroup ? avatar : avatarPlaceHolder,
            _react2.default.createElement(
                'div',
                { className: 'sk-msg-wrapper' },
                _react2.default.createElement(
                    'div',
                    { className: containerClass.join(' '),
                        style: style,
                        ref: 'messageContent' },
                    message,
                    actionList
                )
            ),
            _react2.default.createElement('div', { className: 'sk-clear' })
        );
    };

    return MessageComponent;
}(_react.Component);

MessageComponent.propTypes = {
    name: _react.PropTypes.string,
    actions: _react.PropTypes.array,
    role: _react.PropTypes.string.isRequired,
    mediaUrl: _react.PropTypes.string,
    text: _react.PropTypes.string,
    accentColor: _react.PropTypes.string,
    linkColor: _react.PropTypes.string,
    firstInGroup: _react.PropTypes.bool,
    lastInGroup: _react.PropTypes.bool
};
MessageComponent.defaultProps = {
    actions: []
};