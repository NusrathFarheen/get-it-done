import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dzdvcprqudikcwilhfzq.supabase.co';
const supabaseKey = 'sb_publishable_o73sQRICE99GL0IV4ayAhQ_GJpEhVVe';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing signUp...');
  const { data, error } = await supabase.auth.signUp({
    email: 'testbug@example.com',
    password: 'Password123!',
    options: {
      data: { name: 'Bug Tester', role: 'client' }
    }
  });

  console.log('SignUp Data:', JSON.stringify(data, null, 2));
  console.log('SignUp Error:', error);
  
  if (data?.user) {
    console.log('Testing insert to profiles...');
    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: data.user.id,
        email: 'testbug@example.com',
        name: 'Bug Tester',
      }
    ]);
    console.log('Profile Insert Error:', profileError);
  }
}

test();
