import React, { useEffect, useState } from 'react';
import { OrderIcon } from '../../../../elements/OrderIcon';
import Button from '../../../../elements/Button';
import { ResourceIcon } from '../../../../elements/ResourceIcon';
import { findResourceById } from '../../../../constants/resources';
import { ReactComponent as RatioIcon } from '../../../../assets/icons/common/ratio.svg';
import { useComponentValue } from '@dojoengine/react';
import { useDojo } from '../../../../DojoContext';
import { Utils } from '@dojoengine/core';
import { Realm } from '../../../../types';

type ResourcesOffer = {
    resourceId: number;
    amount: number;
}
type TradeOfferProps = {
    // offerId: number;
    // resourcesGive: ResourcesOffer[];
    // resourcesGet: ResourcesOffer[];
    // timeLeft: number;
    // ratio: number;
    // realm: {
    //     id: number;
    //     name: string;
    //     order: string;
    // }
    tradeId: number;
}

export const TradeOffer = ({ tradeId, ...props }: TradeOfferProps) => {
    const [state, setState] = useState();

    const {
        components: { Trade, FungibleEntities, Resource, Realm },
      } = useDojo();

    let trade = useComponentValue(Trade, Utils.getEntityIdFromKeys([BigInt(tradeId)]));
    
    // set maker order
    let makerRealm: Realm | undefined;
    if (trade) {
        makerRealm = useComponentValue(Realm, Utils.getEntityIdFromKeys([BigInt(trade.maker_id)]));
    }

    const resourcesGet = trade && getResources(trade.maker_order_id);
    const resourcesGive = trade && getResources(trade.taker_order_id);
    
    function getResources(orderId: number): ResourcesOffer[] {
        const resources: ResourcesOffer[] = [];
        const fungibleEntities = useComponentValue(FungibleEntities, Utils.getEntityIdFromKeys([BigInt(orderId)]));
        if (fungibleEntities) {
          for (let i = 0; i < fungibleEntities.count; i++) {
            const resource = useComponentValue(
              Resource,
              Utils.getEntityIdFromKeys([BigInt(orderId), BigInt(fungibleEntities.key), BigInt(i)])
            );
            if (resource) {
              resources.push({ amount: resource.balance, resourceId: resource.resource_type });
            }
          }
        }
        return resources;
      }

    let timeLeft: string | undefined;
    if (trade) {
        timeLeft = formatTimeLeft(trade.expires_at - Date.now()/1000);
    };

    useEffect(() => { }, []);

    return (
        <div className='flex flex-col p-2 border rounded-md border-gray-gold text-xxs text-gray-gold'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center p-1 -mt-2 -ml-2 border border-t-0 border-l-0 rounded-br-md border-gray-gold'>
                    {/* // order of the order maker */}
                    {/* // TODO: get order name by order ID */}
                    {makerRealm && makerRealm.order && <OrderIcon order={'power'} size="xs" className='mr-1' />}
                    {/* // TODO: get realm name (by realm ID) */}
                    {makerRealm?.realm_id}
                </div>
                <div className='-mt-2 text-gold'>
                    {timeLeft}
                </div>
            </div>
            <div className='flex items-end mt-2'>
                <div className='flex items-center justify-around flex-1'>
                    <div className='grid w-1/3 grid-cols-3 gap-2 text-gold'>
                        {resourcesGive && resourcesGive.map(({ resourceId, amount }) => (
                            <div className='flex flex-col items-center'>
                                <ResourceIcon key={resourceId} resource={findResourceById(resourceId)?.trait as any} size='xs' className='mb-1' />
                                {amount}
                            </div>
                        ))}
                    </div>
                    <div className='flex flex-col items-center text-white'>
                        {/* // TODO: do we keep this? what is it? */}
                        <RatioIcon className="mb-1 fill-white" />
                        1.00
                    </div>
                    <div className='grid w-1/3 grid-cols-3 gap-2 text-gold'>
                        {resourcesGet && resourcesGet.map(({ resourceId, amount }) => (
                            <div className='flex flex-col items-center'>
                                <ResourceIcon key={resourceId} resource={findResourceById(resourceId)?.trait as any} size='xs' />
                                {amount}
                            </div>

                        ))}
                    </div>
                </div>
                <Button onClick={() => { }} variant='success' className='ml-auto p-2 !h-4 text-xxs !rounded-md'>Accept</Button>
            </div>
        </div >
    );
};

const formatTimeLeft = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
  
    return `${days} days ${hours}h:${minutes}m`;
  };
  