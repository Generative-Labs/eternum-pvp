import { useMemo, useState } from "react";
import { RealmInterface } from "../graphql/useGraphQLQueries";
import { getComponentValue, Has, HasValue, runQuery } from "@latticexyz/recs";
import { useDojo } from "../../DojoContext";
import { getEntityIdFromKeys } from "../../utils/utils";
import { getOrderName } from "@bibliothecadao/eternum";
import realmIdsByOrder from "../../data/realmids_by_order.json";
import realmsData from "../../geodata/realms.json";
import { unpackResources } from "../../utils/packedData";
import { useEntityQuery } from "@dojoengine/react";

export function useRealm() {
  const {
    setup: {
      components: { Realm },
    },
  } = useDojo();

  const getNextRealmIdForOrder = (order: number) => {
    const orderName = getOrderName(order);

    const entityIds = runQuery([HasValue(Realm, { order })]);

    let latestRealmIdFromOrder = 0;

    // sort from biggest to lowest
    if (entityIds.size > 0) {
      const realmEntityId = Array.from(entityIds).sort((a, b) => b - a)[0];
      const latestRealmFromOrder = getComponentValue(Realm, realmEntityId);
      if (latestRealmFromOrder) {
        latestRealmIdFromOrder = latestRealmFromOrder.realm_id;
      }
    }
    const orderRealmIds = (realmIdsByOrder as { [key: string]: number[] })[orderName];
    const latestIndex = orderRealmIds.indexOf(latestRealmIdFromOrder);

    if (latestIndex === -1 || latestIndex === orderRealmIds.length - 1) {
      return orderRealmIds[0];
    } else {
      return orderRealmIds[latestIndex + 1];
    }
  };

  return {
    getNextRealmIdForOrder,
  };
}

export function useGetRealm(realmEntityId: number | undefined) {
  const {
    setup: {
      components: { Realm, Position, Owner, Army },
    },
  } = useDojo();

  const [realm, setRealm] = useState<RealmInterface | undefined>(undefined);
  useMemo((): any => {
    if (realmEntityId) {
      let entityId = getEntityIdFromKeys([BigInt(realmEntityId)]);
      const realm = getComponentValue(Realm, entityId);
      const army = getComponentValue(Army, entityId);
      const owner = getComponentValue(Owner, entityId);
      const position = getComponentValue(Position, entityId);

      if (realm && owner && position) {
        const {
          realm_id,
          cities,
          rivers,
          wonder,
          harbors,
          regions,
          resource_types_count,
          resource_types_packed,
          order,
        } = realm;
        const { address } = owner;
        setRealm({
          realmId: realm_id,
          cities,
          rivers,
          wonder,
          harbors,
          regions,
          resource_types_count,
          resource_types_packed,
          order,
          position,
          owner: address,
          infantry_qty: army?.infantry_qty || 0,
          cavalry_qty: army?.cavalry_qty || 0,
          mage_qty: army?.mage_qty || 0,
        });
      }
    }
  }, [realmEntityId]);

  return {
    realm,
  };
}

export function useGetRealms() {
  const {
    setup: {
      components: { Realm, Owner, Army },
    },
  } = useDojo();

  const realmEntityIds = useEntityQuery([Has(Realm)]);
  const armyIds = useEntityQuery([Has(Army)]);
  const realms: any[] = useMemo(
    () =>
      Array.from(realmEntityIds).map((entityId) => {
        const realm = getComponentValue(Realm, entityId) as any;
        const army = getComponentValue(Army, entityId) as any;
        realm.entity_id = entityId;
        realm.name = realmsData["features"][realm.realm_id - 1].name;
        realm.owner = getComponentValue(Owner, entityId);
        realm.infantry_qty = army?.infantry_qty || 0;
        realm.cavalry_qty = army?.cavalry_qty || 0;
        realm.mage_qty = army?.mage_qty || 0;
        realm.resources = unpackResources(BigInt(realm.resource_types_packed), realm.resource_types_count);

        return realm;
      }),
    [realmEntityIds, armyIds],
  );
  const armies: any[] = useMemo(
    () =>
      Array.from(armyIds).map((entityId) => {
        const army = getComponentValue(Army, entityId) as any;
        army.entity_id = entityId;

        return army;
      }),
    [armyIds],
  );
  return {
    realms,
    armies,
  };
}

export function useGetChallenges() {
  const {
    setup: {
      components: { Challenges },
    },
  } = useDojo();

  const challengesEntityIds = useEntityQuery([Has(Challenges)]);
  const challenges: any[] = useMemo(
    () =>
      Array.from(challengesEntityIds).map((entityId) => {
        return getComponentValue(Challenges, entityId) as any;
      }),
    [challengesEntityIds],
  );
  return {
    challenges,
  };
}
