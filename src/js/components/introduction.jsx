import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import { findDOMNode } from 'react-dom';

import { AlternateChannels } from './alternate-channels';
import { DefaultAppIcon } from './default-app-icon';

import { setIntroHeight } from '../actions/app-state-actions';

import { createMarkup } from '../utils/html';
import { getAppChannelDetails } from '../utils/app';

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
        const {app, introductionText, headerText} = this.props;

        return (
            <div
                className='sk-intro-section'
                ref='introductionContainer'
            >
                {
                    app.iconUrl ? (
                        <img
                            className='app-icon'
                            alt='App icon'
                            src={app.iconUrl}
                        />
                    ) : (
                        <DefaultAppIcon/>
                    )
                }
                <div className='text-column'>
                    <div className='app-name'>
                        {headerText}
                    </div>
                    <div
                        className='intro-text'
                        dangerouslySetInnerHTML={createMarkup(introductionText)}
                    />
                </div>
            </div>
        );
    }
}

export const Introduction = connect(({app, appState: {introHeight, widgetState}, ui: {text}}) => {
    return {
        app,
        appState: {
            introHeight,
            widgetState
        },
        headerText: text.headerText,
        introductionText: text.introductionText
    };
})(IntroductionComponent);
