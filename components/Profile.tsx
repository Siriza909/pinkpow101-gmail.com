// src/pages/Profile.tsx

export default function Profile() {
  async function registerFingerprint() {
    try {
      if (
        !("credentials" in navigator) ||
        typeof navigator.credentials.create !== "function"
      ) {
        alert("เบราว์เซอร์ของคุณไม่รองรับ WebAuthn");
        return;
      }

      const publicKey = {
        challenge: new Uint8Array(32), // ควรขอจาก server จริง
        rp: { name: "YourApp" },
        user: {
          id: new Uint8Array(16), // user ID
          name: "username",
          displayName: "User Display Name",
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
      };

      const credential = await navigator.credentials.create({ publicKey });
      console.log("Credential created:", credential);
      alert("ลงทะเบียนลายนิ้วมือสำเร็จ!");
    } catch (error) {
      console.error("ล้มเหลว:", error);
      alert("ไม่สามารถลงทะเบียนลายนิ้วมือได้");
    }
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <button onClick={registerFingerprint}>ลงทะเบียนลายนิ้วมือ</button>
    </div>
  );
}
