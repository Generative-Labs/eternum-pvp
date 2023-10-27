import { useState } from "react";
import { ReactComponent as CloseIcon } from "../assets/icons/common/cross-circle.svg";
import { SecondaryPopup } from "../elements/SecondaryPopup";
import { Headline } from "../elements/Headline";
import Button from "../elements/Button";
import { useDojo } from "../DojoContext";
import { NumberInput } from "../elements/NumberInput";
import useRealmStore from "../hooks/store/useRealmStore";
import { useComponentValue } from "@dojoengine/react";
import { getEntityIdFromKeys } from "../utils/utils";
import { ResourcesIds } from "@bibliothecadao/eternum";

type SettingsComponentProps = {};

export const CreateArmyComponent = ({}: SettingsComponentProps) => {
  const {
    setup: {
      components: { Resource },
      systemCalls: { generate_infantry, generate_cavalry, generate_mage },
    },
    account: { account },
  } = useDojo();
  const { realmEntityId } = useRealmStore();
  const [showArmy, setShowArmy] = useState(false);
  const [infantryCount, setInfantryCount] = useState(0);
  const [mageCount, setMageCount] = useState(0);
  const [cavalryCount, setCavalryCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const wood = useComponentValue(
    Resource,
    getEntityIdFromKeys([BigInt(realmEntityId ?? 0), BigInt(ResourcesIds.Wood)]),
  );
  const gold = useComponentValue(
    Resource,
    getEntityIdFromKeys([BigInt(realmEntityId ?? 0), BigInt(ResourcesIds.Gold)]),
  );
  const copper = useComponentValue(
    Resource,
    getEntityIdFromKeys([BigInt(realmEntityId ?? 0), BigInt(ResourcesIds.Copper)]),
  );

  return (
    <div className="flex items-center text-white">
      <button
        onClick={async () => {
          setShowArmy(true);
        }}
        className="flex items-center hover:bg-gold/20 transition-bg duration-200 z-10 px-2 py-1 ml-auto text-xxs border rounded-md text-gold border-gold"
      >
        Create army
      </button>
      {showArmy && (
        <SecondaryPopup className="top-1/3" name="settings">
          <SecondaryPopup.Head>
            <div className="flex items-center">
              <div className="mr-0.5">Army</div>
              <CloseIcon className="w-3 h-3 cursor-pointer fill-white" onClick={() => setShowArmy(false)} />
            </div>
          </SecondaryPopup.Head>
          <SecondaryPopup.Body width="400px">
            <div className="flex flex-col  space-y-2 p-3">
              <Headline size="big">Create Army</Headline>
              <div className="text-gold">Please recruit soldiers and build your army!</div>
              <div className="text-gold text-xs">1. One wheat can recruit a infantry</div>
              <div className="text-gold text-xs">2. One copper can recruit a cavalryCount</div>
              <div className="text-gold text-xs">3. One gold can recruit a Mage</div>
              <Headline size="big">Generate count:</Headline>
              <div className="flex items-center">
                <div className="italic text-light-pink">Infantry:</div>
                <NumberInput
                  className="ml-2 mr-2"
                  value={infantryCount}
                  step={1}
                  onChange={setInfantryCount}
                  max={wood.balance || 99}
                />
              </div>
              <div className="flex items-center">
                <div className="italic text-light-pink">Cavalry:</div>
                <NumberInput
                  className="ml-2 mr-2"
                  value={cavalryCount}
                  step={1}
                  onChange={setCavalryCount}
                  max={copper.balance || 99}
                />
              </div>
              <div className="flex items-center">
                <div className="italic text-light-pink">Mage:</div>
                <NumberInput
                  className="ml-2 mr-2"
                  value={mageCount}
                  step={1}
                  onChange={setMageCount}
                  max={gold.balance || 99}
                />
              </div>
              <Button
                onClick={async () => {
                  setLoading(true);
                  if (infantryCount && infantryCount > 0) {
                    await generate_infantry({
                      signer: account,
                      realm_id: realmEntityId,
                      amount: infantryCount,
                    });
                  }
                  if (cavalryCount && cavalryCount > 0) {
                    await generate_cavalry({
                      signer: account,
                      realm_id: realmEntityId,
                      amount: cavalryCount,
                    });
                  }
                  if (mageCount && mageCount > 0) {
                    await generate_mage({
                      signer: account,
                      realm_id: realmEntityId,
                      amount: mageCount,
                    });
                  }
                  setLoading(false);
                  setShowArmy(false);
                }}
                variant="outline"
                disabled={loading}
                className="text-xxs !py-1 !px-2 mr-auto w-full"
              >
                Confirm
              </Button>
            </div>
          </SecondaryPopup.Body>
        </SecondaryPopup>
      )}
    </div>
  );
};
