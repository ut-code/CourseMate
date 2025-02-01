{
  description = "CourseMate";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/release-24.11";
    # this isn't latest branch. latest is `master`, and branch `unstable` requires some tests to pass before rebase
    # also prisma v6 is only out on this branch.
    nixpkgs-unstable.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    prisma-utils.url = "github:VanCoding/nix-prisma-utils";
    prisma-utils.inputs.pkgs.follows = "nixpkgs";
  };

  outputs = {
    nixpkgs,
    nixpkgs-unstable,
    flake-utils,
    rust-overlay,
    prisma-utils,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      overlays = [(import rust-overlay)];
      unstable = nixpkgs-unstable.legacyPackages.${system};
      pkgs = import nixpkgs {
        inherit system overlays;
      };
      # unstable-pkgs = unstable.legacyPackages.${system};
      rust-bin = pkgs.rust-bin.fromRustupToolchainFile ./scraper/rust-toolchain.toml;
      prisma-bin = (pkgs.callPackage ./server/prisma.nix {inherit prisma-utils;}).package;

      common = {
        packages =
          (with unstable; [
            bun # needed for text-based lock file (1.1.39+)
          ])
          ++ (with pkgs; [
            nix # HACK: to fix the side effect of the hack below, installing two instances of nix
            gnumake
            nodejs
            biome
            lefthook
            dotenv-cli
            stdenv.cc.cc.lib
          ]);

        env = {
          # requird by prisma
          PRISMA_QUERY_ENGINE_BINARY = "${prisma-bin}/bin/query-engine";
          PRISMA_QUERY_ENGINE_LIBRARY = "${prisma-bin}/lib/libquery_engine.node";
          PRISMA_INTROSPECTION_ENGINE_BINARY = "${prisma-bin}/bin/introspection-engine";
          PRISMA_SCHEMA_ENGINE = "${prisma-bin}/bin/schema-engine";
          # HACK: sharp can't find libstdc++.so.6 on bun without this
          # - hack because: setting this may break other packages
          # - info: it can find libstdc++.so.6 on Node.js
          # - info: NobbZ says it's because "We can not set an rpath for a scripting language"
          LD_LIBRARY_PATH = "${pkgs.stdenv.cc.cc.lib}/lib";
        };
      };
    in {
      packages.scraper = pkgs.callPackage ./scraper {toolchain = rust-bin;};
      devShells.default = pkgs.mkShell common;
      devShells.docker = pkgs.mkShell {
        packages = with pkgs; [
          bun
          gnumake
          nodejs
          biome
          lefthook
          dotenv-cli
          helix
          openssl_1_1
        ];
      };
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
