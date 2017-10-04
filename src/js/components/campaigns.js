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

        const reversedCampaigns = campaigns.reverse()

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
                        const avatar_url = campaign.message.author ? campaign.message.author.avatar_url : ''

                        const author_name = campaign.message.author ? campaign.message.author.name : ''

                        return (
                            <div
                                key={campaign.slug}
                                className='campaign'
                            >
                                <div className='message-area'>
                                    <div className='avatar'>
                                        <img src={avatar_url}/>
                                    </div>
                                    <div className='message'>
                                        <div className='author-name'>
                                            {author_name}
                                        </div>
                                        {campaign.message.text}
                                    </div>
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