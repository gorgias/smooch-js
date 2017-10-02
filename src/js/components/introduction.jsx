import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import { findDOMNode } from 'react-dom';

import { setIntroHeight } from '../actions/app-state-actions';

import { createMarkup } from '../utils/html';
import classnames from 'classnames';

export class IntroductionComponent extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        appState: PropTypes.object.isRequired,
        app: PropTypes.object.isRequired,
        headerText: PropTypes.string.isRequired,
        introductionText: PropTypes.string.isRequired
    };

    constructor(...args) {
        super(...args);
        this._debounceClientHeightCalculation = debounce(this.calculateIntroHeight.bind(this), 150);
    }

    componentDidMount() {
        // Height of Introduction component will be computed on render and on resize only
        window.addEventListener('resize', this._debounceClientHeightCalculation);
        setTimeout(this.calculateIntroHeight.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._debounceClientHeightCalculation);
    }

    componentDidUpdate() {
        setTimeout(this.calculateIntroHeight.bind(this));
    }

    calculateIntroHeight() {
        const {appState: {introHeight}, dispatch} = this.props;
        const node = findDOMNode(this.refs.introductionContainer);

        if (node) {
            const nodeHeight = node.offsetHeight;

            if (introHeight !== nodeHeight) {
                dispatch(setIntroHeight(nodeHeight));
            }
        }
    }

    render() {
        const {appState: {displayAgents, isChatOnline}, introductionText, headerText, offlineIntroductionText} = this.props;

        return (
            <div
                className={classnames('sk-intro-section', {'online': isChatOnline, 'offline': !isChatOnline})}
                ref='introductionContainer'
            >
                <div className={classnames('agent-avatars-wrapper', {offline: !isChatOnline})}>
                    {
                        displayAgents.map((agent, idx) => {
                            const first = idx === 0;
                            const last = idx === displayAgents.length - 1;
                            const middle = (!first && !last) || (idx === 1);

                            return (
                                <div
                                    key={idx}
                                    className={classnames('agent-avatar', {first, middle, last})}
                                >
                                    <img src={agent.avatar_url} />
                                    {
                                        isChatOnline && <div className='online-marker'/>
                                    }
                                </div>
                            );
                        })
                    }
                </div>
                <div className='text-column'>
                    <div className='app-name'>
                        {headerText}
                    </div>
                    <div
                        className='intro-text'
                        dangerouslySetInnerHTML={createMarkup(isChatOnline ? introductionText : offlineIntroductionText)}
                    />
                </div>
            </div>
        );
    }
}

export const Introduction = connect(({app, appState: {introHeight, widgetState, displayAgents, isChatOnline}, ui: {text}}) => {
    return {
        app,
        appState: {
            displayAgents,
            isChatOnline,
            introHeight,
            widgetState
        },
        headerText: text.headerText,
        introductionText: text.introductionText,
        offlineIntroductionText: text.offlineIntroductionText
    };
})(IntroductionComponent);
