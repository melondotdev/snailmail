module lancer::job_post {
  use sui::url::{Self, Url};
  use std::string:: {utf8, String};
  use sui::object::{Self, ID, UID};
  use sui::event;
  use sui::transfer;
  use sui::tx_context::{Self, TxContext};
  
  use sui::package;
  use sui::display;
  
  struct JobPostNFT has key {
    id: UID,
    company: String,
    email: String,
    discord: Url,
    twitter: Url,
    name: String,
    description: String,
    reward: String,
    image_url: Url,
  }
  
  /// One-Time-Witness for module
  struct JOB_POST has drop {}
  
  // ===== Events =====
  
  struct NFTMinted has copy, drop {
    // Object ID of NFT
    object_id: ID,
    // Creator of the NFT
    creator: address,
    // Name of the NFT
    name: String,
  }
  
  // ===== Public view functions =====
  
  // Get company
  public fun company(nft: &JobPostNFT): &String {
    &nft.company
  }
  
  // Get email
  public fun email(nft: &JobPostNFT): &String {
    &nft.email
  }
  
  // Get discord
  public fun discord(nft: &JobPostNFT): &Url {
    &nft.discord
  }
  
  // Get twitter
  public fun twitter(nft: &JobPostNFT): &Url {
    &nft.twitter
  }
  
  // Get name
  public fun name(nft: &JobPostNFT): &String {
    &nft.name
  }
  
  // Get description
  public fun description(nft: &JobPostNFT): &String {
    &nft.description
  }
  
  // Get reward
  public fun reward(nft: &JobPostNFT): &String {
    &nft.reward
  }

  // Get image_url
  public fun image_url(nft: &JobPostNFT): &Url {
    &nft.image_url
  }

  // ===== Initialize package =====
  fun init(otw: JOB_POST, ctx: &mut TxContext) {
    let keys = vector[
      utf8(b"company"),
      utf8(b"email"),
      utf8(b"discord"),
      utf8(b"twitter"),
      utf8(b"name"),
      utf8(b"description"),
      utf8(b"reward"),
      utf8(b"image_url"),
    ];

    let values = vector[
      utf8(b"{company}"),
      utf8(b"{email}"),
      utf8(b"{discord}"),
      utf8(b"{twitter}"),
      utf8(b"{name}"),
      utf8(b"{description}"),
      utf8(b"{reward}"),
      utf8(b"{image_url}"),
    ];
    
    // Claim the `Publisher` for the package!
    let publisher = package::claim(otw, ctx);

    // Get a new `Display` object for the `Hero` type.
    let display = display::new_with_fields<JobPostNFT>(
        &publisher, keys, values, ctx
    );
    
    // Commit first version of `Display` to apply changes.
    display::update_version(&mut display);
    
    transfer::public_transfer(publisher, tx_context::sender(ctx));
    transfer::public_transfer(display, tx_context::sender(ctx));
  }
  
  // ===== Entrypoints =====

  /// Create a new job_post NFT
  public entry fun mint_to_sender(
    company: vector<u8>,
    email: vector<u8>,
    discord: vector<u8>,
    twitter: vector<u8>,
    name: vector<u8>,
    description: vector<u8>,
    reward: vector<u8>,
    image_url: vector<u8>,
    ctx: &mut TxContext
  ) {
    let nft = JobPostNFT {
      id: object::new(ctx),
      company: utf8(company),
      email: utf8(email),
      discord: url::new_unsafe_from_bytes(discord),
      twitter: url::new_unsafe_from_bytes(twitter),
      name: utf8(name),
      description: utf8(description),
      reward: utf8(reward),
      image_url: url::new_unsafe_from_bytes(image_url),
    };
    
    event::emit(NFTMinted {
      object_id: object::id(&nft),
      creator: tx_context::sender(ctx),
      name: nft.name,
    });

    transfer::transfer(nft, tx_context::sender(ctx));
  }
  
  /// Transfer nft to recipient
  public entry fun transfer(
    nft: JobPostNFT, recipient: address, _: &mut TxContext
  ) {
    transfer::transfer(nft, recipient);
  }
  
  /// Update fields of nft
  public entry fun update_nft(
    nft: &mut JobPostNFT,
    new_email: vector<u8>,
    new_discord: vector<u8>,
    new_twitter: vector<u8>,
    new_name: vector<u8>,
    new_description: vector<u8>,
    new_reward: vector<u8>,
    new_image_url: vector<u8>,
    _: &mut TxContext
  ) {
    nft.email = utf8(new_email);
    nft.discord = url::new_unsafe_from_bytes(new_discord);
    nft.twitter = url::new_unsafe_from_bytes(new_twitter);
    nft.name = utf8(new_name);
    nft.description = utf8(new_description);
    nft.reward = utf8(new_reward);
    nft.image_url = url::new_unsafe_from_bytes(new_image_url);
  }
  
  /// Permanently delete nft
  public entry fun burn(nft: JobPostNFT, _: &mut TxContext) {
    let JobPostNFT { id, company: _, email: _, discord: _, twitter: _, name: _, description: _, reward: _, image_url: _ } = nft;
    object::delete(id);
  }
}