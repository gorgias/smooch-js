import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import * as appStateActions from './../actions/app-state-actions';
import * as conversationActions from './../actions/conversation-actions';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const campaignMessage = (text, authorName, authorAvatarUrl) => {
    return {
        firstInGroup: true,
        lastInGroup: true,
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

    _replyToCampaign = (text, authorName, authorAvatarUrl) => {
        this.props.hideAllDisplayedCampaigns();
        this.props.openWidget();
        this.props.addMessage(campaignMessage(text, authorName, authorAvatarUrl));
    }

    render() {
        const {campaigns, displayAgents} = this.props;

        // We reverse the campaigns order so that new campaigns appear on the top
        const reversedCampaigns = campaigns.reverse();

        return (
            <div className='campaigns'>
                <ReactCSSTransitionGroup
                    transitionName='transition-wrapper'
                    transitionAppear={true}
                    transitionAppearTimeout={800}
                    transitionEnterTimeout={200}
                    transitionLeaveTimeout={200}
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
                                className='campaign'
                            >
                                <div className='message-area'>
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

                                <div
                                    className='reply-area'
                                    onClick={() => this._replyToCampaign(campaign.message.text, authorName, authorAvatarUrl)}
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

export const CampaignList = connect(({appState: {displayAgents}}) => {
    return {
        displayAgents
    };
}, {
    hideAllDisplayedCampaigns: appStateActions.hideAllDisplayedCampaigns,
    openWidget: appStateActions.openWidget,
    addMessage: conversationActions.addMessage
})(CampaignListComponent);