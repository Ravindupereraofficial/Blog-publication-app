import { Auth } from '@supabase/auth-ui-react';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  return (
    <div style={{ width: 400, margin: 'auto', paddingTop: '100px' }}>
      <Auth supabaseClient={supabase} />
    </div>
  );
}
