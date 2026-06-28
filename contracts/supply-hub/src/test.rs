#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::Address as _,
    token::{StellarAssetClient, TokenClient},
    Address, Env, String,
};

fn setup_token(env: &Env, admin: &Address) -> Address {
    env.register_stellar_asset_contract(admin.clone())
}

fn mint(env: &Env, token: &Address, to: &Address, amount: i128) {
    let stellar = StellarAssetClient::new(env, token);
    stellar.mint(to, &amount);
}

#[test]
fn test_init_sets_owner_and_name() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, SupplyHubContract);
    let client = SupplyHubContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let name = String::from_str(&env, "Nova Supply Hub");

    client.init(&owner, &name);

    assert_eq!(client.get_owner(), owner);
    assert_eq!(client.get_name(), name);
    assert_eq!(client.get_balance(), 0);
    assert_eq!(client.get_shipment_count(), 0);
}

#[test]
fn test_purchase_transfers_tokens_and_updates_balance() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, SupplyHubContract);
    let client = SupplyHubContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let customer = Address::generate(&env);
    let name = String::from_str(&env, "Nova Supply Hub");

    client.init(&owner, &name);

    let token = setup_token(&env, &owner);
    mint(&env, &token, &customer, 10_000_000);

    let token_client = TokenClient::new(&env, &token);
    let purchase_amount: i128 = 3_500_000;

    client.purchase(&customer, &token, &purchase_amount, &101u64);

    assert_eq!(client.get_balance(), purchase_amount);
    assert_eq!(client.get_shipment_count(), 1);
    assert_eq!(token_client.balance(&owner), purchase_amount);
    assert_eq!(token_client.balance(&customer), 10_000_000 - purchase_amount);
}

#[test]
#[should_panic(expected = "Error(Contract, #1)")]
fn test_init_twice_panics() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, SupplyHubContract);
    let client = SupplyHubContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let name = String::from_str(&env, "Nova Supply Hub");

    client.init(&owner, &name);
    client.init(&owner, &name);
}

#[test]
#[should_panic(expected = "Error(Contract, #4)")]
fn test_purchase_zero_amount_panics() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, SupplyHubContract);
    let client = SupplyHubContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let customer = Address::generate(&env);
    let name = String::from_str(&env, "Nova Supply Hub");

    client.init(&owner, &name);

    let token = setup_token(&env, &owner);
    client.purchase(&customer, &token, &0i128, &1u64);
}

#[test]
#[should_panic(expected = "Error(Contract, #2)")]
fn test_purchase_before_init_panics() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, SupplyHubContract);
    let client = SupplyHubContractClient::new(&env, &contract_id);

    let customer = Address::generate(&env);
    let owner = Address::generate(&env);
    let token = setup_token(&env, &owner);

    client.purchase(&customer, &token, &100i128, &1u64);
}
