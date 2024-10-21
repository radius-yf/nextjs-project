// server only

import { auth } from '@/auth';
import { graphqlAuthToken, url } from '@/config';
import { getSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

/**
 * Fetch GraphQL data
 * @param query
 * @param operationName
 * @param variables
 * @param header
 * @returns
 */
export async function fetchGraphQL(
  query: string,
  operationName: string = '',
  variables: any = {},
  header: any = {}
) {
  const body = {
    query,
    variables,
    operationName
  };
  const token =
    typeof window === 'undefined'
      ? (await auth())?.user?.auth
      : (await getSession())?.user?.auth;
  const res = await fetch(url + '/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: graphqlAuthToken,
      Authorization2: token,
      ...header
    },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  if (json.errors) {
    const errInfo = json.errors[0];
    if (errInfo.extensions.code === 403) {
      redirect('/login');
      // throw Error('Unauthorized');
    } else {
      // eslint-disable-next-line no-console
      console.log('graphql error', operationName, errInfo, body);
      throw Error(operationName + ': ' + errInfo.message);
    }
  } else {
    // eslint-disable-next-line no-console
    console.log('graphql response', operationName);
  }
  return json;
}
