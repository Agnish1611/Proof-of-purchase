use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, mint_to, Token, TokenAccount};

declare_id!("pU5DzQPweFLmigGKEQtA7v8NRG5PThRrR3Qvqo6ECU2");

#[error_code]
pub enum ErrorCode {
    #[msg("Not enough scans to complete campaign")]
    InsufficientScans,
    #[msg("Campaign is not active")]
    CampaignNotActive,
}

#[account]
pub struct UserAccount {
    pub wallet: Pubkey,
    pub scan_count: u32,
    pub tokens_earned: u64,
    pub loyalty_tier: u8,
}

#[account]
pub struct ScanLog {
    pub user: Pubkey,
    pub sku: String,
    pub timestamp: u64,
    pub warranty_days: u64,
}

#[account]
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

#[program]
pub mod walmart_contract {
    use super::*;
    use anchor_spl::token::MintTo;

    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        user_account.wallet = ctx.accounts.user.key();
        user_account.scan_count = 0;
        user_account.tokens_earned = 0;
        user_account.loyalty_tier = 0;
        Ok(())
    }

    pub fn log_scan(
        ctx: Context<LogScan>,
        sku: String,
        timestamp: u64,
        warranty_days: u64,
    ) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        let scan_log = &mut ctx.accounts.scan_log;
        user_account.scan_count = user_account.scan_count.checked_add(1).unwrap();
        scan_log.user = ctx.accounts.user.key();
        scan_log.sku = sku;
        scan_log.timestamp = timestamp;
        scan_log.warranty_days = warranty_days;
        Ok(())
    }

    pub fn initialize_campaign(
        ctx: Context<InitializeCampaign>,
        campaign_id: String,
        brand: String,
        required_skus: Vec<String>,
        scan_count_req: u32,
        reward_tokens: u64,
        token_mint: Pubkey,
        start_date: u64,
        end_date: u64,
    ) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        campaign.campaign_id = campaign_id;
        campaign.brand = brand;
        campaign.required_skus = required_skus;
        campaign.scan_count_req = scan_count_req;
        campaign.reward_tokens = reward_tokens;
        campaign.token_mint = token_mint;
        campaign.start_date = start_date;
        campaign.end_date = end_date;
        Ok(())
    }

    pub fn complete_campaign(ctx: Context<CompleteCampaign>) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        let campaign = &ctx.accounts.campaign;
        if user_account.scan_count < campaign.scan_count_req {
            return Err(ErrorCode::InsufficientScans.into());
        }
        let now = Clock::get()?.unix_timestamp as u64;
        if now < campaign.start_date || now > campaign.end_date {
            return Err(ErrorCode::CampaignNotActive.into());
        }
        user_account.tokens_earned = user_account.tokens_earned.checked_add(campaign.reward_tokens).unwrap();

        let cpi_accounts = MintTo {
            mint: ctx.accounts.token_mint.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.vault_authority.to_account_info(),
        };
        let bump = ctx.bumps.vault_authority;
        let seeds: &[&[u8]] = &[b"vault-authority", &[bump]];
        let signer_seeds: &[&[&[u8]]] = &[seeds];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        mint_to(cpi_ctx, campaign.reward_tokens)?;
        Ok(())
    }

    pub fn upgrade_loyalty(ctx: Context<UpgradeLoyalty>) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        if user_account.scan_count >= 100 && user_account.loyalty_tier < 3 {
            user_account.loyalty_tier += 1;
        } else if user_account.scan_count >= 50 && user_account.loyalty_tier < 2 {
            user_account.loyalty_tier += 1;
        } else if user_account.scan_count >= 10 && user_account.loyalty_tier < 1 {
            user_account.loyalty_tier += 1;
        }
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(init, seeds = [b"user", user.key().as_ref()], bump, payer = user, space = 8 + 32 + 4 + 8 + 1)]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)] pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(sku: String, timestamp: u64, warranty_days: u64)]
pub struct LogScan<'info> {
    #[account(mut, seeds = [b"user", user.key().as_ref()], bump)]
    pub user_account: Account<'info, UserAccount>,
    #[account(init, seeds = [b"scan", user.key().as_ref(), sku.as_bytes(), &timestamp.to_le_bytes()], bump, payer = user, space = 8 + 32 + (4 + 32) + 8 + 8)]
    pub scan_log: Account<'info, ScanLog>,
    #[account(mut)] pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(campaign_id: String, brand: String, required_skus: Vec<String>, scan_count_req: u32, reward_tokens: u64, token_mint: Pubkey, start_date: u64, end_date: u64)]
pub struct InitializeCampaign<'info> {
    #[account(init, seeds = [b"campaign", campaign_id.as_bytes()], bump, payer = authority, space = 8 + (4 + 32) + (4 + 32) + (4 + required_skus.len() * 32) + 4 + 8 + 32 + 8 + 8)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)] pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CompleteCampaign<'info> {
    #[account(mut)] pub user_account: Account<'info, UserAccount>,
    pub campaign: Account<'info, Campaign>,
    #[account(mut)] pub token_mint: Account<'info, Mint>,
    #[account(mut)] pub user_token_account: Account<'info, TokenAccount>,
    /// CHECK: PDA used as mint authority
    #[account(seeds = [b"vault-authority"], bump)] pub vault_authority: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpgradeLoyalty<'info> {
    #[account(mut, seeds = [b"user", user.key().as_ref()], bump)] pub user_account: Account<'info, UserAccount>,
    #[account(mut)] pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
