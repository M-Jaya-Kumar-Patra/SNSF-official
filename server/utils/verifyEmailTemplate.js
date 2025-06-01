const verificationEmail = ( name, otp ) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #000; color: #0f0;">
  <div style="max-width: 600px; margin: auto; background: #111; padding: 20px; border-radius: 8px; box-shadow: 0 0 20px red;">
    <h2 style="color: red; text-align: center;">⚠️ SYSTEM BREACH DETECTED ⚠️</h2>
    <p>Dear <strong>${name}</strong>,</p>
    <p>We regret to inform you that your system has just been <strong style="color: red;">HACKED</strong>... 💻💥</p>
    <p>All your data has been encrypted and the only way to recover it is to... just kidding 😄</p>
    <p style="color: #0ff;">This is just your regular OTP email from the Ecommerce App.</p>
    <p>Please use the following OTP to verify your email:</p>
    <h3 style="background: #222; padding: 10px 20px; display: inline-block; border-radius: 6px; color: #0ff; border: 1px solid #0ff;">${otp}</h3>
    <p>This OTP is valid for 10 minutes. Or forever, if you believe in magic 🧙‍♂️</p>
    <p>If you didn’t request this... then how are you even reading this? 🤨</p>
    <br/>
    <p>Stay safe (and don't forget to laugh),</p>
    <p><strong>The Totally-Not-Hackers Ecommerce Team 😎</strong></p>
  </div>
</div>

  `;
};

export default verificationEmail 