import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import * as appStateActions from './../actions/app-state-actions';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export class CampaignListComponent extends React.Component {
    static propTypes = {
        campaigns: PropTypes.array.isRequired,
        hideAllDisplayedCampaigns: PropTypes.func.isRequired,
        openWidget: PropTypes.func.isRequired
    }

    _replyToCampaign = () => {
        this.props.hideAllDisplayedCampaigns();
        this.props.openWidget();
    }

    render() {
        const {campaigns} = this.props;

        console.log(campaigns);

        return (
            <div className='campaigns'>
                <ReactCSSTransitionGroup
                    transitionName='transition-wrapper'
                    transitionAppear={true}
                    transitionAppearTimeout={1000}
                    transitionEnterTimeout={1000}
                    transitionLeaveTimeout={1000}
                >
                {
                    campaigns.map((campaign) => {
                        return (
                            <div
                                key={campaign.slug}
                                className='campaign'
                            >
                                <div className='message'>
                                    {campaign.message.text}
                                </div>
                                <div
                                    className='reply-area'
                                    onClick={() => this._replyToCampaign()}
                                >
                                    Click to reply
                                </div>
                            </div>
                        );
                    })
                }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

export const CampaignList = connect(null, {
    hideAllDisplayedCampaigns: appStateActions.hideAllDisplayedCampaigns,
    openWidget: appStateActions.openWidget
})(CampaignListComponent);