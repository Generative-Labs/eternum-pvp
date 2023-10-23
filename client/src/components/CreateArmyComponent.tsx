import { useState } from "react";
import { ReactComponent as CloseIcon } from "../assets/icons/common/cross-circle.svg";
import { SecondaryPopup } from "../elements/SecondaryPopup";
import { Headline } from "../elements/Headline";
import Button from "../elements/Button";
import { useDojo } from "../DojoContext";
import { NumberInput } from "../elements/NumberInput";
import useRealmStore from "../hooks/store/useRealmStore";

type SettingsComponentProps = {};

const army = {
  infantry_qty: 99,
  cavalry_qty: 99,
  mage_qty: 99,
};

export const CreateArmyComponent = ({}: SettingsComponentProps) => {
  const {
    setup: {
      systemCalls: { generate_infantry },
    },
    account: { account },
  } = useDojo();
  const { realmEntityId } = useRealmStore();
  const [showArmy, setShowArmy] = useState(false);
  const [selfAmount, setSelfAmount] = useState(0);
  const [targetAmount, setTargetAmount] = useState(0);

  return (
    <div className="flex items-center text-white">
      <button
        onClick={async () => {
          console.log("create ");
          await generate_infantry({
            signer: account,
            realm_id: realmEntityId,
            amount: 10,
          });
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
              <div className="text-gold text-xs">1. One wheat can recruit a soldier</div>
              <div className="text-gold text-xs">2. One copper can recruit a knight</div>
              <div className="text-gold text-xs">3. One gold can recruit a mage</div>
              <div className="flex items-center">
                <div className="mt-2 space-x-2">
                  <div className="text-gold inline-block">
                    infantry_qty: <span className="text-white">{army.infantry_qty}</span>
                  </div>
                  <div className="text-gold inline-block">
                    cavalry_qty: <span className="text-white">{army.cavalry_qty}</span>
                  </div>
                  <div className="text-gold inline-block">
                    mage_qty: <span className="text-white">{army.mage_qty}</span>
                  </div>
                </div>
                <div className="italic text-light-pink">Soldier:</div>
                <NumberInput className="ml-2 mr-2" value={selfAmount} step={1} onChange={setSelfAmount} max={9999} />
              </div>
              <div className="flex items-center">
                <div className="italic text-light-pink">Knight:</div>
                <NumberInput
                  className="ml-2 mr-2"
                  value={targetAmount}
                  step={1}
                  onChange={setTargetAmount}
                  max={9999}
                />
              </div>
              <div className="flex items-center">
                <div className="italic text-light-pink">Mage:</div>
                <NumberInput
                  className="ml-2 mr-2"
                  value={targetAmount}
                  step={1}
                  onChange={setTargetAmount}
                  max={9999}
                />
              </div>
              <Button
                onClick={() => {
                  setShowArmy(false);
                }}
                variant="outline"
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
