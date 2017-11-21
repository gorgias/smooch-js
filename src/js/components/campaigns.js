import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import * as appStateActions from './../actions/app-state-actions';
import * as conversationActions from './../actions/conversation-actions';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {openWidget} from "../services/app";

const campaignMessage = (id, text, authorName, authorAvatarUrl, firstInGroup, lastInGroup) => {
    return {
        _id: id,
        firstInGroup: firstInGroup,
        lastInGroup: lastInGroup,
        role: 'appMaker',
        source: {
            type: 'api'
        },
        type: 'text',
        text,
        name: authorName,
        avatarUrl: authorAvatarUrl,
        received: Math.round((new Date()).getTime() / 1000)
    };
};

export class CampaignListComponent extends React.Component {
    static propTypes = {
        campaigns: PropTypes.array.isRequired,
        hideAllDisplayedCampaigns: PropTypes.func.isRequired,
        openWidget: PropTypes.func.isRequired,
        addMessage: PropTypes.func.isRequired,
        displayAgents: PropTypes.array.isRequired
    }

    _replyToCampaign = () => {
        const {campaigns} = this.props

        this.props.hideAllDisplayedCampaigns();
        this.props.openWidget();

        campaigns.forEach((campaign, idx) => {
            const authorAvatarUrl = campaign.message.author ? campaign.message.author.avatar_url : '';
            const authorName = campaign.message.author ? campaign.message.author.name : '';
            const firstInGroup = idx === 0
            const lastInGroup = idx === campaigns.length - 1

            this.props.addMessage(campaignMessage(campaign.id, campaign.message.text, authorName, authorAvatarUrl, firstInGroup, lastInGroup));
        });
    }

    render() {
        const {campaigns, displayAgents} = this.props;

        // We reverse the campaigns order so that new campaigns appear on the top
        const reversedCampaigns = campaigns.reverse();

        const campaignsWrapper = reversedCampaigns.length > 0 ? (
            <div
                className='campaign'
                onClick={() => this._replyToCampaign()}
            >
                {
                    reversedCampaigns.map((campaign) => {
                        if (_isEmpty(campaign.message.author) && displayAgents.length) {
                            campaign.message.author = displayAgents[0];
                        }

                        const authorAvatarUrl = campaign.message.author ? campaign.message.author.avatar_url : '';
                        const authorName = campaign.message.author ? campaign.message.author.name : '';

                        return (
                                <div
                                    key={campaign.id}
                                    className='message-area'
                                >
                                    <div className='avatar'>
                                        <img src={authorAvatarUrl}/>
                                    </div>
                                    <div className='message'>
                                        <div className='author-name'>
                                            {authorName}
                                        </div>
                                        <div dangerouslySetInnerHTML={{__html: campaign.message.html}}/>
                                    </div>
                                </div>
                        );
                    })
                }
                <div className='reply-area'>
                    Click to reply
                </div>
            </div>
        ) : null

        return (
            <div className='campaigns'>
                <ReactCSSTransitionGroup
                    transitionName='transition-wrapper'
                    transitionAppear={true}
                    transitionAppearTimeout={800}
                    transitionEnterTimeout={200}
                    transitionLeaveTimeout={200}
                >
                    {campaignsWrapper}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

export const CampaignList = connect(({appState: {displayAgents}}) => {
    return {
        displayAgents
    };
}, {
    hideAllDisplayedCampaigns: appStateActions.hideAllDisplayedCampaigns,
    openWidget: openWidget,
    addMessage: conversationActions.addMessage
})(CampaignListComponent);