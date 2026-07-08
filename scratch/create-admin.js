const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createAdmin() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'ajay.jadhav.openac@gmail.com',
    password: 'Sarkari@Naukari$123',
    email_confirm: true
  });
  if (error) {
    if (error.message.includes('already been registered')) {
      console.log('Admin user already exists!');
    } else {
      console.error('Error creating admin:', error.message);
    }
  } else {
    console.log('Admin user created successfully:', data.user.id);
  }
}
createAdmin();
