use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod serialisation_test {
    use super::*;

    pub fn maak_reactie(ctx: Context<MaakReactie>, data: Reactie) -> Result<()> {
        let reactie = &mut ctx.accounts.reactie_account;
        reactie.set_inner(data);

        Ok(())
    }
}

#[account]
pub struct Reactie {
    pub discord_handle  : String,
    pub twitter_handle  : String,
    pub cv_url          : String,
    pub github_handle   : String,

    pub id_van_vacature : u32,
    pub eigenaar        : Pubkey,
    pub reactie_id      : u16,
}

impl Reactie {
    pub const MAX_BYTES_DISCORD: usize = 37; // 32 naam + 1 '#' + 4 getallen
    pub const MAX_BYTES_TWITTER: usize = 15;
    pub const MAX_BYTES_URL:     usize = 100;
    pub const MAX_BYTES_GITHUB:  usize = 39;

    pub const SPACE: usize =
        4 + Self::MAX_BYTES_DISCORD +
        4 + Self::MAX_BYTES_TWITTER +
        4 + Self::MAX_BYTES_URL     +
        4 + Self::MAX_BYTES_GITHUB  +
        4 +
        32 +
        1;
}

#[derive(Accounts)]
pub struct MaakReactie<'info> {
    #[account(
        init,
        space = 8 + Reactie::SPACE,
        payer = maker
    )]
    pub reactie_account: Account<'info, Reactie>,

    #[account(mut)]
    pub maker: Signer<'info>,
    pub system_program: Program<'info, System>
}
