import React, { useState } from 'react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // ตัวอย่างเช็คง่าย ๆ
    if (!email || !password) {
      setError('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    // ตรงนี้แหละ ใส่ logic ล็อกอินจริง (API, Firebase, etc.)
    console.log('ล็อกอินด้วย:', { email, password });

    // สมมติล็อกอินสำเร็จ
    alert('ล็อกอินสำเร็จ 🎉');
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>เข้าสู่ระบบ</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>อีเมล</label><br />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="กรอกอีเมล"
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>รหัสผ่าน</label><br />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="กรอกรหัสผ่าน"
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
        <button type="submit" style={{ padding: '10px 20px' }}>เข้าสู่ระบบ</button>
      </form>
    </div>
  );
};

export default Login;
