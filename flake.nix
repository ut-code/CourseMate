{
  description = "CourseMate";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/release-24.11";
    # prisma v6 is only out on unstable uncomment this on updating prisma to v6. can be removed when 25.05 channel is released
    # unstable.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    nixpkgs,
    flake-utils,
    rust-overlay,
    /*
    unstable,
    */
    ...
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      overlays = [(import rust-overlay)];
      pkgs = import nixpkgs {
        inherit system overlays;
      };
      # unstable-pkgs = unstable.legacyPackages.${system};
      rust-bin = pkgs.rust-bin.fromRustupToolchainFile ./scraper/rust-toolchain.toml;

      common = {
        packages = with pkgs; [
          gnumake
          bun
          nodejs-slim
          biome
          lefthook
          dotenv-cli
          prisma
          stdenv.cc.cc.lib
        ];

        env = with pkgs; {
          # requird by prisma
          PRISMA_QUERY_ENGINE_BINARY = "${prisma-engines}/bin/query-engine";
          PRISMA_QUERY_ENGINE_LIBRARY = "${prisma-engines}/lib/libquery_engine.node";
          PRISMA_INTROSPECTION_ENGINE_BINARY = "${prisma-engines}/bin/introspection-engine";
          PRISMA_FMT_BINARY = "${prisma-engines}/bin/prisma-fmt";
        };
      };
    in {
      packages.scraper = pkgs.callPackage ./scraper {toolchain = rust-bin;};
      devShells.default = pkgs.mkShell common;
      devShells.scraper = pkgs.mkShell {
        inherit (common) env;
        packages =
          common.packages
          ++ [
            pkgs.pkg-config
            pkgs.openssl
            rust-bin
          ];
      };
    });
}
