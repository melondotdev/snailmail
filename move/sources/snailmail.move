module suisnails::snailmail {
  use sui::url::{Self, Url};
  use std::string:: {utf8, String};
  use sui::object::{Self, ID, UID};
  use sui::event;
  use sui::transfer;
  use sui::tx_context::{Self, TxContext};
  
  use sui::package;
  use sui::display;
  
  struct SnailMailNFT has key {
    id: UID,
    name: String,
    description: String,
    image_url: Url,
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
    
    transfer::public_transfer(publisher, tx_context::sender(ctx));
    transfer::public_transfer(display, tx_context::sender(ctx));
  }
  
  // ===== Entrypoints =====

  /// Create a new job_post NFT
  public entry fun mint_to_recipient(
    name: vector<u8>,
    description: vector<u8>,
    image_url: vector<u8>,
    recipient: address,
    ctx: &mut TxContext
  ) {
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
}