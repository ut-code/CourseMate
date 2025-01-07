{
  description = "CourseMate";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/release-24.11";
    # prisma v6 is only out on unstable uncomment this on updating prisma to v6. can be removed when 25.05 channel is released
    # unstable.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

    flake-utils.url = "github:numtide/flake-utils";
    fenix = {
      url = "github:nix-community/fenix/monthly";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { nixpkgs, flake-utils, fenix, /* unstable, */ ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        # unstable-pkgs = unstable.legacyPackages.${system};
        rust-toolchain = import ./nix/rust-toolchain.nix { inherit fenix system; };

        common = {
          buildInputs = with pkgs; [
            gnumake
            bun
            biome
            lefthook
            dotenv-cli
            prisma
            prisma-engines
          ];

          shellHook = with pkgs; ''
            # requird by prisma
            export PRISMA_QUERY_ENGINE_BINARY="${prisma-engines}/bin/query-engine";
            export PRISMA_QUERY_ENGINE_LIBRARY="${prisma-engines}/lib/libquery_engine.node";
            export PRISMA_INTROSPECTION_ENGINE_BINARY="${prisma-engines}/bin/introspection-engine";
            export PRISMA_FMT_BINARY="${prisma-engines}/bin/prisma-fmt";

            export LD_LIBRARY_PATH=${pkgs.stdenv.cc.cc.lib}/lib
          '';
        };
      in
      {
        devShells.default = pkgs.mkShell common;
        devShells.scraper = pkgs.mkShell {
          buildInputs = common.buildInputs ++ [
            pkgs.pkg-config
            pkgs.openssl
            rust-toolchain
          ];
          shellHook = common.shellHook;
        };
      });
}

