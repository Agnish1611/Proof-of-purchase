# Proof of Purchase - Web3 Loyalty & Rewards Platform

A decentralized proof-of-purchase system built on Solana blockchain that enables brands to run loyalty campaigns, track product scans, and reward customers with tokens and NFT-based tier upgrades.

## 🌟 Overview

This project demonstrates a complete Web3 application that combines blockchain technology with traditional e-commerce concepts. Users can scan product QRs/barcodes, participate in brand campaigns, earn tokens, and upgrade their loyalty tiers through NFT minting - all secured on the Solana blockchain.

## ✨ Key Features

### 🔗 Blockchain Integration
- **Solana Network**: Built on Solana devnet for fast, low-cost transactions
- **Anchor Framework**: Smart contracts written in Rust using Anchor framework
- **Wallet Integration**: Support for Phantom and Solflare wallets

### 🎯 Core Functionality
- **Product Scanning**: Log product purchases via QR/barcode scanning with warranty tracking
- **Campaign System**: Brands can create time-limited campaigns with specific product requirements
- **Token Rewards**: Earn SPL tokens for completing campaigns and scanning products
- **Loyalty Tiers**: Progressive NFT-based loyalty system (Scout → Cadet → Forager → Commander → Tyrant)
- **Proof of Purchase**: Immutable, timestamped scan records stored on-chain

### 👤 User Experience
- **Dashboard**: View scan history, campaign progress, and loyalty status
- **Campaign Participation**: Browse and participate in active brand campaigns
- **Tier Progression**: Automatic NFT minting based on scan count milestones
- **Responsive Design**: Modern UI built with React, TypeScript, and shadcn/ui components

## 🏗️ Architecture

### 📁 Project Structure

```
proof-of-purchase/
├── client/                 # React Frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Solana interaction utilities
│   │   └── idl/           # Anchor program IDL definitions
│   └── package.json
├── server/                 # Node.js Backend (Express + TypeScript)
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Express middleware
│   │   └── config/        # Database and environment config
│   └── package.json
├── smart-contract/         # Solana Program (Rust + Anchor)
│   ├── programs/
│   │   └── walmart-contract/
│   │       └── src/lib.rs # Main contract logic
│   ├── tests/             # Anchor test files
│   └── Anchor.toml
└── README.md
```

### 🔧 Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite for fast development and building
- Solana wallet adapters for Web3 integration
- shadcn/ui components with Tailwind CSS
- React Router for navigation
- TanStack Query for state management

**Backend:**
- Node.js with Express and TypeScript
- MongoDB with Mongoose (configured but optional)
- JWT authentication middleware
- Rate limiting and security headers
- CORS configuration for cross-origin requests

**Blockchain:**
- Solana blockchain (devnet)
- Anchor framework for smart contract development
- SPL Token program for rewards
- Custom PDAs (Program Derived Addresses) for data storage

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or later)
- **Rust** with Solana and Anchor installed
- **Solana CLI** configured for devnet
- **Phantom** or **Solflare** wallet browser extension

### 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd proof-of-purchase
   ```

2. **Install dependencies for all components:**
   ```bash
   # Frontend
   cd client && npm install
   
   # Backend  
   cd ../server && npm install
   
   # Smart Contract
   cd ../smart-contract && npm install
   ```

### ⚙️ Configuration

#### Smart Contract Setup
1. **Configure Solana CLI:**
   ```bash
   solana config set --url devnet
   solana config set --keypair ~/.config/solana/id.json
   ```

2. **Fund your wallet with devnet SOL:**
   ```bash
   solana airdrop 2
   ```

3. **Build and deploy the smart contract:**
   ```bash
   cd smart-contract
   anchor build
   anchor deploy
   ```

4. **Update program ID:**
   - Copy the deployed program ID
   - Update `smart-contract/programs/walmart-contract/src/lib.rs` line 7
   - Update `client/src/idl/walmart_contract.ts` address field
   - Rebuild: `anchor build`

#### Backend Setup
1. **Create environment file:**
   ```bash
   cd server
   cp .env.example .env
   ```

2. **Configure environment variables:**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/proof-of-purchase
   JWT_SECRET=your-jwt-secret-key
   COOKIE_SECRET=your-cookie-secret-key
   CORS_ORIGIN=http://localhost:5173
   ```

#### Frontend Setup
1. **Update smart contract configuration:**
   - Ensure `client/src/idl/walmart_contract.ts` has the correct program address
   - Verify token mint addresses in `client/src/utils/instructions.ts`

## 🎮 Usage

### 🔄 Running the Application

1. **Start the smart contract local validator (if testing locally):**
   ```bash
   cd smart-contract
   solana-test-validator
   ```

2. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```

3. **Start the frontend development server:**
   ```bash
   cd client
   npm run dev
   ```

4. **Access the application:**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

### 💡 Using the Platform

#### For Users:
1. **Connect Wallet**: Connect your Phantom/Solflare wallet
2. **Initialize Account**: First-time users will be prompted to initialize their on-chain account
3. **Scan Products**: Use the scan modal to log product purchases with QR/barcode data
4. **Join Campaigns**: Browse and participate in active brand campaigns
5. **Earn Rewards**: Complete campaign requirements to earn tokens
6. **Upgrade Tier**: Accumulate scans to automatically unlock higher loyalty tiers

#### For Admins:
1. **Access Admin Panel**: Navigate to `/admin` (requires admin wallet)
2. **Create Campaigns**: Set up new campaigns with specific requirements
3. **Manage Tokens**: Configure reward amounts and campaign parameters

## 🔧 Smart Contract Details

### Core Instructions

- **`initialize_user`**: Creates a user account PDA for tracking scans and loyalty
- **`log_scan`**: Records a product scan with SKU, timestamp, and warranty information
- **`initialize_campaign`**: Creates a new brand campaign with requirements and rewards
- **`complete_campaign`**: Allows users to claim rewards after meeting campaign requirements  
- **`upgrade_loyalty`**: Mints tier-appropriate NFTs based on user scan count

### Data Structures

```rust
pub struct UserAccount {
    pub wallet: Pubkey,
    pub scan_count: u32,
    pub tokens_earned: u64,
    pub loyalty_tier: u8,
}

pub struct Campaign {
    pub campaign_id: String,
    pub brand: String,
    pub required_skus: Vec<String>,
    pub scan_count_req: u32,
    pub reward_tokens: u64,
    pub token_mint: Pubkey,
    pub start_date: u64,
    pub end_date: u64,
}

pub struct ScanLog {
    pub user: Pubkey,
    pub sku: String,
    pub timestamp: u64,
    pub warranty_days: u64,
}
```

## 🧪 Testing

### Smart Contract Tests
```bash
cd smart-contract
anchor test
```

### Frontend Development
```bash
cd client
npm run lint        # Run linting
npm run build       # Build for production
npm run preview     # Preview production build
```

### Backend Development  
```bash
cd server
npm run lint        # Run linting
npm run build       # Build TypeScript
npm run start       # Run production build
```

## 🚀 Deployment

### Smart Contract
1. Configure mainnet/devnet in `Anchor.toml`
2. Run `anchor deploy --provider.cluster <network>`
3. Update program IDs in frontend code

### Frontend
1. Build: `npm run build`
2. Deploy `dist/` folder to static hosting (Vercel, Netlify, etc.)
3. Update environment variables for production API endpoints

### Backend
1. Set production environment variables
2. Build: `npm run build`  
3. Deploy to cloud provider (Railway, Heroku, AWS, etc.)
4. Configure MongoDB connection string

## 🔒 Security Considerations

- **Private Key Management**: Never commit private keys or seed phrases
- **Program Authority**: Use multisig wallets for production program upgrades
- **Input Validation**: Validate all user inputs both client and server-side
- **Rate Limiting**: API endpoints include rate limiting protection
- **CORS**: Properly configured CORS policies for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Troubleshooting

### Common Issues

**Wallet Connection Issues:**
- Ensure you have Phantom or Solflare installed
- Check that you're on the correct network (devnet for development)
- Clear browser cache and restart the application

**Smart Contract Deployment Fails:**
- Verify you have sufficient SOL in your wallet
- Check that Anchor.toml is configured correctly
- Ensure Rust and Anchor are up to date

**Transaction Failures:**
- Confirm you have enough SOL for transaction fees
- Verify all required accounts are properly initialized
- Check the browser console for detailed error messages

**Backend API Issues:**
- Verify MongoDB is running (if using database features)
- Check environment variables are properly set
- Ensure CORS configuration allows frontend origin

## 🔗 Additional Resources

- [Solana Documentation](https://docs.solana.com/)
- [Anchor Framework Guide](https://book.anchor-lang.com/)
- [React Documentation](https://reactjs.org/docs)
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)

---