module suisnails::snailmail {
  use sui::url::{Self, Url};
  use std::vector;
  use std::string:: {utf8, String};

  use sui::object::{Self, ID, UID};
  use sui::tx_context::{Self, TxContext, sender};
  use sui::event;
  
  use sui::sui::SUI;
  use sui::balance::{Self, Balance};
  use sui::coin::{Self, Coin};
  use sui::pay;
  use sui::transfer;
  
  use sui::package;
  use sui::display;
  
  const DEFAULT_FEE: u64 = 20_000_000;
  
  const ENotMaintainer: u64 = 1;
  const ENoBalance: u64 = 2;
  
  struct SnailMailNFT has key {
    id: UID,
    name: String,
    description: String,
    image_url: Url,
  }
  
  struct SnailMailNFTMaintainer has key {
    id: UID,
    maintainer_address: address,
    mail_count: u64,
    fee: u64,
    balance: Balance<SUI>,
  }
  
  /// One-Time-Witness for module
  struct SNAILMAIL has drop {}
  
  // ===== Events =====
  
  struct NFTMinted has copy, drop {
    // Object ID of NFT
    object_id: ID,
    // Creator of the NFT
    creator: address,
    // Name of the NFT
    name: String,
    // Name of the NFT
    description: String,
  }
  
  // ===== Public view functions =====
  
  // Get name
  public fun name(nft: &SnailMailNFT): &String {
    &nft.name
  }
  
  // Get description
  public fun description(nft: &SnailMailNFT): &String {
    &nft.description
  }

  // Get image_url
  public fun image_url(nft: &SnailMailNFT): &Url {
    &nft.image_url
  }

  // ===== Initialize package =====
  fun init(otw: SNAILMAIL, ctx: &mut TxContext) {
    let keys = vector[
      utf8(b"name"),
      utf8(b"description"),
      utf8(b"image_url"),
    ];
    
    let values = vector[
      utf8(b"{name}"),
      utf8(b"{description}"),
      utf8(b"{image_url}"),
    ];
    
    // Claim the `Publisher` for the package!
    let publisher = package::claim(otw, ctx);

    // Get a new `Display` object for the `Hero` type.
    let display = display::new_with_fields<SnailMailNFT>(
        &publisher, keys, values, ctx
    );
    
    // Commit first version of `Display` to apply changes.
    display::update_version(&mut display);
    
    let maintainer = SnailMailNFTMaintainer {
      id: object::new(ctx),
      maintainer_address: sender(ctx),
      mail_count: 0,
      fee: DEFAULT_FEE,
      balance: balance::zero<SUI>(),
    };
    
    transfer::public_transfer(publisher, tx_context::sender(ctx));
    transfer::public_transfer(display, tx_context::sender(ctx));
    transfer::share_object(maintainer);
  }
  
  // ===== Entrypoints =====

  /// Create a new job_post NFT
  public entry fun mint_to_recipient(
    maintainer: &mut SnailMailNFTMaintainer,
    fee: vector<Coin<SUI>>,
    name: vector<u8>,
    description: vector<u8>,
    image_url: vector<u8>,
    recipient: address,
    ctx: &mut TxContext
  ) {
    let (paid, remainder) = merge_and_split(fee, maintainer.fee, ctx);
    
    coin::put(&mut maintainer.balance, paid);
    transfer::public_transfer(remainder, tx_context::sender(ctx));
    
    let nft = SnailMailNFT {
      id: object::new(ctx),
      name: utf8(name),
      description: utf8(description),
      image_url: url::new_unsafe_from_bytes(image_url),
    };
    
    event::emit(NFTMinted {
      object_id: object::id(&nft),
      creator: tx_context::sender(ctx),
      name: nft.name,
      description: nft.description,
    });
    
    maintainer.mail_count = maintainer.mail_count + 1;
    
    transfer::transfer(nft, recipient);
  }
  
  /// Transfer nft to recipient
  public entry fun transfer(
    nft: SnailMailNFT, recipient: address, _: &mut TxContext
  ) {
    transfer::transfer(nft, recipient);
  }
  
  /// Permanently delete nft
  public entry fun burn(nft: SnailMailNFT, _: &mut TxContext) {
    let SnailMailNFT { id, name: _, description: _, image_url: _ } = nft;
    object::delete(id);
  }

  // ===== Maintainer Functions =====
  public entry fun pay_maintainer(maintainer: &mut SnailMailNFTMaintainer, ctx: &mut TxContext) {
    assert!(tx_context::sender(ctx) == maintainer.maintainer_address, ENotMaintainer);
    let amount = balance::value<SUI>(&maintainer.balance);
    assert!(amount > 0, ENoBalance);
    let payment = coin::take(&mut maintainer.balance, amount, ctx);
    transfer::public_transfer(payment, tx_context::sender(ctx));
  }
  
  public entry fun change_maintainer(maintainer: &mut SnailMailNFTMaintainer, new_maintainer: address, ctx: &mut TxContext) {
    assert!(tx_context::sender(ctx) == maintainer.maintainer_address, ENotMaintainer);
    maintainer.maintainer_address = new_maintainer;
  }
  
  public entry fun change_fee(maintainer: &mut SnailMailNFTMaintainer, new_fee: u64, ctx: &mut TxContext) {
    assert!(tx_context::sender(ctx) == maintainer.maintainer_address, ENotMaintainer);
    maintainer.fee = new_fee;
  }
  
  fun merge_and_split(
    coins: vector<Coin<SUI>>, amount: u64, ctx: &mut TxContext
  ): (Coin<SUI>, Coin<SUI>) {
    let base = vector::pop_back(&mut coins);
    pay::join_vec(&mut base, coins);
    let coin_value = coin::value(&base);
    assert!(coin_value >= amount, coin_value);
    (coin::split(&mut base, amount, ctx), base)
  }
}