import React, {PropTypes} from 'react';

export class CampaignList extends React.Component {
    static propTypes = {
        campaigns: PropTypes.array.isRequired
    }

    render() {
        const {campaigns} = this.props;

        console.log(campaigns);

        return (
            <div className='campaigns'>
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
                                <div className='reply-area'>
                                    Click to reply
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}