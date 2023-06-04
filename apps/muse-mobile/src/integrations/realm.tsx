import React from 'react';
import { Profile } from '../model';
import { createRealmContext } from '@realm/react';

// Create a configuration object
const realmConfig: Realm.Configuration = {
  schema: [Profile],
};
// Create a realm context
const { RealmProvider, useRealm, useObject, useQuery } =
  createRealmContext(realmConfig);

export const RealmWrapper = ({ children }: { children: React.ReactNode }) => {
  return <RealmProvider>{children}</RealmProvider>;
};

export { useRealm, useObject, useQuery };
