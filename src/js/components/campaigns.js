import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

export class CampaignListComponent extends React.Component {
    static propTypes = {
        campaigns: PropTypes.array.isRequired
    }

    render() {
        const {campaigns} = this.props;

        console.log(campaigns);

        return (
            <div className="campaigns">
                {
                    campaigns.map((campaign) => {
                        return (
                            <div key={campaign.slug} className="campaign">
                                {campaign.name}
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export const CampaignList = connect(({appState: {displayedCampaigns}}) => {
    return {
        campaigns: displayedCampaigns
    };
})(CampaignListComponent);