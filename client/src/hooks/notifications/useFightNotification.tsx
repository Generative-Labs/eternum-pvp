import { useDojo } from "../../DojoContext";
import { getComponentValue } from "@latticexyz/recs";
import { displayAddress, getEntityIdFromKeys } from "../../utils/utils";
import { NotificationType } from "./useNotifications";
import { useGetRealm } from "../helpers/useRealm";
import Button from "../../elements/Button";
import { useMemo } from "react";
import { ReactComponent as FightLost } from "../../assets/icons/common/fight-lost.svg";
import { ReactComponent as FightWaiting } from "../../assets/icons/common/fight-waiting.svg";
import { ReactComponent as FightWin } from "../../assets/icons/common/fight-win.svg";
import { ReactComponent as FightReject } from "../../assets/icons/common/fight-reject.svg";
import { Headline } from "../../elements/Headline";

export enum ChallengeStateEnum {
  craeted,
  rejected,
  sender_win,
  target_win,
  draw,
}

const ChallengeStateEnumMap = {
  [ChallengeStateEnum.craeted]: "craeted",
  [ChallengeStateEnum.rejected]: "rejected",
  [ChallengeStateEnum.sender_win]: "sender_win",
  [ChallengeStateEnum.target_win]: "target_win",
  [ChallengeStateEnum.draw]: "draw",
};

export const useFightNotification = (
  notification: NotificationType,
): {
  type: string;
  time: string;
  title: React.ReactElement;
  content: React.ReactElement;
} => {
  const {
    setup: {
      components: { Challenges },
      systemCalls: { accept_challenge, reject_challenge },
    },
    account: { account },
  } = useDojo();

  const challengeEntityId = notification.keys[0];

  const challenge = getComponentValue(Challenges, getEntityIdFromKeys([BigInt(challengeEntityId)]));
  const { realm: senderRealm } = useGetRealm(challenge.sender_id);
  const { realm: targetRealm } = useGetRealm(challenge.target_id);

  // const realmName = realm ? getRealmNameById(realm.realm_id) : "";
  // const realmOrderName = realm ? getRealmOrderNameById(realm?.realm_id) : "";
  //
  // const resource = findResourceById(parseInt(notification.keys[1]))?.trait || "";
  //
  // const harvestAmount = notification.data && "harvestAmount" in notification.data ? notification.data.harvestAmount : 0;
  const reject = async () => {
    await reject_challenge({
      signer: account,
      challenge_id: challengeEntityId,
      realm_id: challenge.target_id,
    });
  };
  const accept = async () => {
    await accept_challenge({
      signer: account,
      challenge_id: challengeEntityId,
      realm_id: challenge.target_id,
    });
  };

  const showBtns = useMemo(() => {
    if (challenge.state !== ChallengeStateEnum.craeted) {
      return false;
    }
    if (targetRealm?.owner && targetRealm.owner === account.address) {
      return true;
    }
    return false;
  }, [challenge, targetRealm, senderRealm]);

  const contentTitle = useMemo(() => {
    if (targetRealm?.owner && targetRealm.owner === account.address) {
      // is other sender
      return `${displayAddress(senderRealm.owner)} is challenging you.`;
    }
    if (senderRealm?.owner && senderRealm.owner === account.address) {
      return `You're challenging ${displayAddress(targetRealm.owner)}.`;
    }
    return `${displayAddress(senderRealm?.owner)} sender challenge to ${displayAddress(targetRealm?.owner)}`;
  }, [challenge, targetRealm, senderRealm]);

  const status = useMemo(() => {
    if (senderRealm?.owner && senderRealm.owner === account.address) {
      if (challenge.state === ChallengeStateEnum.sender_win) {
        return (
          <div className="flex flex-col  space-y-2 p-3">
            <Headline size="big">Results of the challenge</Headline>
            <FightWin className="m-auto" />
            <div className="text-gold w-full text-center">You have won the war.</div>
          </div>
        );
      } else if (challenge.state === ChallengeStateEnum.target_win) {
        return (
          <div className="flex flex-col  space-y-2 p-3">
            <Headline size="big">Results of the challenge</Headline>
            <FightLost className="m-auto" />
            <div className="text-gold w-full text-center">You lost the war.</div>
          </div>
        );
      } else if (challenge.state === ChallengeStateEnum.rejected) {
        return (
          <div className="flex flex-col  space-y-2 p-3">
            <Headline size="big">Results of the challenge</Headline>
            <FightReject className="m-auto" />
            <div className="text-gold w-full text-center">User rejected</div>
          </div>
        );
      } else if (challenge.state === ChallengeStateEnum.craeted) {
        return (
          <div className="flex flex-col  space-y-2 p-3">
            <FightWaiting className="m-auto" />
            <div className="text-gold w-full text-center">Waiting for the other person to accept...</div>
          </div>
        );
      } else if (challenge.state === ChallengeStateEnum.draw) {
        return (
          <div className="flex flex-col  space-y-2 p-3">
            <Headline size="big">Results of the challenge</Headline>
            <FightWaiting className="m-auto" />
            <div className="text-gold w-full text-center">Draw</div>
          </div>
        );
      }
    }
    if (targetRealm?.owner && targetRealm.owner === account.address) {
      if (challenge.state === ChallengeStateEnum.sender_win) {
        return (
          <div className="flex flex-col  space-y-2 p-3">
            <Headline size="big">Results of the challenge</Headline>
            <FightLost className="m-auto" />
            <div className="text-gold w-full text-center">You lost the war.</div>
          </div>
        );
      } else if (challenge.state === ChallengeStateEnum.target_win) {
        return (
          <div className="flex flex-col  space-y-2 p-3">
            <Headline size="big">Results of the challenge</Headline>
            <FightWin className="m-auto" />
            <div className="text-gold w-full text-center">You have won the war.</div>
          </div>
        );
      } else if (challenge.state === ChallengeStateEnum.rejected) {
        return (
          <div className="flex flex-col  space-y-2 p-3">
            <Headline size="big">Results of the challenge</Headline>
            <FightReject className="m-auto" />
            <div className="text-gold w-full text-center">User rejected</div>
          </div>
        );
      } else if (challenge.state === ChallengeStateEnum.craeted) {
        return (
          <div className="flex flex-col  space-y-2 p-3">
            <FightWaiting className="m-auto" />
            <div className="text-gold w-full text-center">Waiting for the other person to accept...</div>
          </div>
        );
      } else if (challenge.state === ChallengeStateEnum.draw) {
        return (
          <div className="flex flex-col  space-y-2 p-3">
            <Headline size="big">Results of the challenge</Headline>
            <FightWaiting className="m-auto" />
            <div className="text-gold w-full text-center">Draw</div>
          </div>
        );
      }
    }
    return ChallengeStateEnumMap[challenge?.state] || "Unknow";
  }, [challenge, targetRealm, senderRealm]);

  return {
    type: "success",
    time: "00:00",
    title: <div className="flex items-center">Challenge Status</div>,
    content: (
      <div className="mt-2 items-center italic">
        <div className="flex">
          <h1>{contentTitle}</h1>
        </div>
        <div>
          <h2>{status}</h2>
        </div>
        {showBtns && (
          <div className="flex justify-between">
            <Button onClick={reject} variant="outline" className="text-xxs w-2/5 mt-2">
              Reject
            </Button>
            <Button onClick={accept} variant="outline" className="text-xxs w-2/5 mt-2">
              Accept
            </Button>
          </div>
        )}
      </div>
    ),
  };
};
