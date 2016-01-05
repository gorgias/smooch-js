import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { scryRenderedDOMComponentsWithId, findRenderedDOMComponentsWithId } from 'test/utils/react';

import { HeaderComponent } from 'components/header.jsx';

const sandbox = sinon.sandbox.create();

const defaultProps = {
    appState: {
        widgetOpened: false,
        settingsEnabled: false,
        settingsVisible: false,
    },
    conversation: {
        messages: []
    },
    actions: {
        showSettings: sandbox.spy(),
        hideSettings: sandbox.spy(),
        toggleWidget: sandbox.spy()
    },
    ui: {
        text: {
            headerText: 'Header',
            settingsHeaderText: 'Settings'
        }
    }
};

describe('Header', () => {
    afterEach(() => {
        sandbox.restore();
        defaultProps.actions.showSettings = sandbox.spy(),
        defaultProps.actions.hideSettings = sandbox.spy(),
        defaultProps.actions.toggleWidget = sandbox.spy()
    });

    [true, false].forEach((settingsEnabled) => {
        describe(`widget is closed with settings ${settingsEnabled ? 'enabled' : 'disabled'}`, () => {
            const props = Object.assign({}, defaultProps, {
                appState: {
                    widgetOpened: false,
                    settingsEnabled: settingsEnabled
                }
            });

            var header;
            var headerNode;

            beforeEach(() => {
                header = TestUtils.renderIntoDocument(<HeaderComponent {...props} />);
                headerNode = ReactDOM.findDOMNode(header);
            });

            it('should not contain the back button', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-back-handle').length.should.be.eq(0);
            });

            it('should not contain the settings button', () => {
                scryRenderedDOMComponentsWithId(header, 'sk-notification-badge').length.should.be.eq(0);
            });

            it('should call the toggleWidget action on header click', () => {
                TestUtils.Simulate.click(headerNode);
                props.actions.toggleWidget.should.have.been.calledOnce;
            });

            it('should contain the show handle', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-show-handle').length.should.be.eq(1);
            });

            it('should not contain the close handle', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-close-handle').length.should.be.eq(0);
            });
        });
    });

    describe('default view with settings off', () => {
        const props = Object.assign({}, defaultProps, {
            appState: {
                widgetOpened: true
            }
        });
        var header;
        var headerNode;

        beforeEach(() => {
            header = TestUtils.renderIntoDocument(<HeaderComponent {...props} />);
            headerNode = ReactDOM.findDOMNode(header);
        });

        it('should display the main header', () => {
            headerNode.textContent.should.eq(props.ui.text.headerText);
        });

        it('should not contain the back button', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-back-handle').length.should.be.eq(0);
        });

        it('should not contain the settings button', () => {
            scryRenderedDOMComponentsWithId(header, 'sk-notification-badge').length.should.be.eq(0);
        });

        it('should call the toggleWidget action on header click', () => {
            TestUtils.Simulate.click(headerNode);
            props.actions.toggleWidget.should.have.been.calledOnce;
        });

        it('should not contain the show handle', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-show-handle').length.should.be.eq(0);
        });

        it('should contain the close handle', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-close-handle').length.should.be.eq(1);
        });
    });


    describe('default view with settings on', () => {
        const props = Object.assign({}, defaultProps, {
            appState: {
                settingsEnabled: true,
                widgetOpened: true
            }
        });

        var header;
        var headerNode;

        beforeEach(() => {
            header = TestUtils.renderIntoDocument(<HeaderComponent {...props} />);
            headerNode = ReactDOM.findDOMNode(header);
        });

        it('should display the main header', () => {
            headerNode.textContent.should.eq(props.ui.text.headerText);
        });

        it('should not contain the back button', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-back-handle').length.should.be.eq(0);
        });

        it('should contain the settings button', () => {
            scryRenderedDOMComponentsWithId(header, 'sk-notification-badge').length.should.be.eq(1);
        });

        it('should call the openSettings action on settings button click', () => {
            let settingsButton = findRenderedDOMComponentsWithId(header, 'sk-notification-badge');
            TestUtils.Simulate.click(settingsButton);
            props.actions.showSettings.should.have.been.calledOnce;
        });

        it('should call the toggleWidget action on header click', () => {
            TestUtils.Simulate.click(headerNode);
            props.actions.toggleWidget.should.have.been.calledOnce;
        });

        it('should not contain the show handle', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-show-handle').length.should.be.eq(0);
        });

        it('should contain the close handle', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-close-handle').length.should.be.eq(1);
        });
    });


    describe('settings view', () => {
        const props = Object.assign({}, defaultProps, {
            appState: {
                settingsEnabled: true,
                settingsVisible: true,
                widgetOpened: true
            }
        });

        var header;
        var headerNode;

        beforeEach(() => {
            header = TestUtils.renderIntoDocument(<HeaderComponent {...props} />);
            headerNode = ReactDOM.findDOMNode(header);
        });

        it('should display the settings header', () => {
            headerNode.textContent.should.eq(props.ui.text.settingsHeaderText);
        });

        it('should not contain the back button', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-back-handle').length.should.be.eq(1);
        });

        it('should not contain the settings button', () => {
            scryRenderedDOMComponentsWithId(header, 'sk-notification-badge').length.should.be.eq(0);
        });

        it('should call the hideSettings action on back button click', () => {
            let backButton = TestUtils.findRenderedDOMComponentWithClass(header, 'sk-back-handle');
            TestUtils.Simulate.click(backButton);
            props.actions.hideSettings.should.have.been.calledOnce;
        });

        it('should call the toggleWidget action on header click', () => {
            TestUtils.Simulate.click(headerNode);
            props.actions.toggleWidget.should.have.been.calledOnce;
        });

        it('should not contain the show handle', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-show-handle').length.should.be.eq(0);
        });

        it('should contain the close handle', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-close-handle').length.should.be.eq(1);
        });
    });
});
