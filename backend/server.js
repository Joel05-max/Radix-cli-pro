import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const VALID_KEYS = {
  '9110563210': { user: 'enterprise_dev', tier: 'Enterprise Pro', quotaRemaining: 999 },
  'radix_live_enterprise_99812': { user: 'enterprise_dev', tier: 'Enterprise Pro', quotaRemaining: 985 },
  'radix_live_free_12345': { user: 'community_user', tier: 'Community Free', quotaRemaining: 12 }
};

app.post('/api/v1/auth/verify', (req, res) => {
  const { apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).json({ valid: false, message: 'API key is required.' });
  }

  const account = VALID_KEYS[apiKey];
  if (account) {
    return res.json({
      valid: true,
      tier: account.tier,
      user: account.user,
      quotaRemaining: account.quotaRemaining
    });
  }

  return res.status(401).json({ valid: false, message: 'Invalid or revoked API key format.' });
});

app.listen(PORT, () => {
  console.log(`\n[Radix Backend Mock] Server running on http://localhost:${PORT}`);
});
