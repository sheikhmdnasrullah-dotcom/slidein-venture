'use client';

/**
 * INTERCOM MESSENGER — anonymous visitors only. The site has no login, so no
 * user_id / name / email / created_at is passed. Mounted once in app/layout.tsx.
 */

import Intercom from '@intercom/messenger-js-sdk';
import { useEffect } from 'react';

const INTERCOM_APP_ID = 'v008pgk4';

export function IntercomMessenger() {
  useEffect(() => {
    Intercom({ app_id: INTERCOM_APP_ID });
  }, []);

  return null;
}
