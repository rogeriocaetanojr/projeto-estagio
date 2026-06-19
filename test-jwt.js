const baseUrl = 'http://localhost:3001/auth';

async function runTests() {
  console.log('--- TESTE JWT ---');

  // 1. Registro
  console.log('\n[1] Registrando usuário...');
  let res = await fetch(`${baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: "test.jwt@unisenai.com",
      password: "testpassword123",
      type: "student",
      ra: "999888777",
      periodo: 1
    })
  });
  let data = await res.json();
  if (res.status !== 201 && res.status !== 409) {
    console.error('Erro no registro:', data);
    return;
  }
  console.log('Status do registro:', res.status);

  // 2. Login
  console.log('\n[2] Fazendo login...');
  res = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: "test.jwt@unisenai.com",
      password: "testpassword123"
    })
  });
  data = await res.json();
  console.log('Status do login:', res.status);
  
  const token = data.access_token;
  if (!token) {
    console.error('Token não recebido:', data);
    return;
  }
  console.log('Token recebido com sucesso! (escondido por segurança)');

  // 3. GET /me COM token
  console.log('\n[3] Requisitando /me COM token...');
  res = await fetch(`${baseUrl}/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  data = await res.json();
  console.log('Status /me COM token:', res.status);
  console.log('Retorno /me:', data);

  // 4. GET /me SEM token
  console.log('\n[4] Requisitando /me SEM token...');
  res = await fetch(`${baseUrl}/me`);
  data = await res.json();
  console.log('Status /me SEM token:', res.status);
  console.log('Retorno de erro:', data);

  console.log('\n--- FIM DO TESTE ---');
}

runTests();
