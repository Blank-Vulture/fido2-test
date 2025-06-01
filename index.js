const express = require('express');
const session = require('express-session');
const path = require('path');
const { 
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse
} = require('@simplewebauthn/server');
const { isoBase64URL } = require('@simplewebauthn/server/helpers');

const app = express();
const port = 3000;

// Session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(express.json());
app.use(express.static('public'));

// RPサーバーの設定
const rpName = 'FIDO2 Test App';
const rpID = 'localhost';
const origin = `http://${rpID}:${port}`;

// ユーザーデータを保存する簡易的なストア
const userStore = new Map();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 登録オプションの生成
app.post('/generate-registration-options', async (req, res) => {
  const userId = 'test-user-' + Math.random().toString(36).substring(7);
  const username = 'testuser';

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: userId,
    userName: username,
    attestationType: 'none',
    authenticatorSelection: {
      authenticatorAttachment: 'cross-platform',
      requireResidentKey: false,
      userVerification: 'required'
    }
  });

  req.session.currentChallenge = options.challenge;
  req.session.userId = userId;
  req.session.username = username;

  res.json(options);
});

// 登録の検証
app.post('/verify-registration', async (req, res) => {
  const { body } = req;

  try {
    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: req.session.currentChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID
    });

    const { verified, registrationInfo } = verification;

    if (verified && registrationInfo) {
      const { credentialPublicKey, credentialID, counter } = registrationInfo;

      const existingUser = userStore.get(req.session.userId) || {
        id: req.session.userId,
        username: req.session.username,
        credentials: []
      };

      existingUser.credentials.push({
        credentialID: credentialID,
        credentialPublicKey: credentialPublicKey,
        counter: counter,
      });

      userStore.set(req.session.userId, existingUser);

      res.json({ verified: true });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// 認証オプションの生成
app.post('/generate-authentication-options', async (req, res) => {
  const user = userStore.get(req.session.userId);
  
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: user.credentials.map(cred => ({
      id: cred.credentialID,
      type: 'public-key',
      transports: ['usb', 'ble', 'nfc'],
    })),
    userVerification: 'required',
  });

  req.session.currentChallenge = options.challenge;

  res.json(options);
});

// 認証の検証
app.post('/verify-authentication', async (req, res) => {
  const { body } = req;
  const user = userStore.get(req.session.userId);

  if (!user) {
    console.error('User not found in store:', req.session.userId);
    return res.status(400).json({ error: 'User not found' });
  }

  try {
    const credential = user.credentials.find(cred => 
      isoBase64URL.fromBuffer(cred.credentialID).toString() === body.id
    );

    if (!credential) {
      console.error('Credential not found:', body.id);
      console.error('Available credentials:', user.credentials.map(c => isoBase64URL.fromBuffer(c.credentialID).toString()));
      throw new Error('Authenticator is not registered with this site');
    }

    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge: req.session.currentChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: credential,
    });

    const { verified } = verification;

    if (!verified) {
      console.error('Verification failed:', verification);
    }

    res.json({ verified });
  } catch (error) {
    console.error('Authentication error:', error);
    console.error('Request body:', body);
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 