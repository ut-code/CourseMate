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
  };

  outputs = {
    nixpkgs,
    nixpkgs-unstable,
    flake-utils,
    rust-overlay,
    /*
    unstable,
    */
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

      common = {
        packages =
          (with unstable; [
            bun # needed for text-based lock file (1.1.39+)
            prisma # needed for prisma 6
          ])
          ++ (with pkgs; [
            nix # HACK: to fix the side effect of the hack below, installing two instances of nix
            gnumake
            nodejs-slim
            biome
            lefthook
            dotenv-cli
            stdenv.cc.cc.lib
          ]);

        env = with pkgs; {
          # requird by prisma
          PRISMA_QUERY_ENGINE_BINARY = "${prisma-engines}/bin/query-engine";
          PRISMA_QUERY_ENGINE_LIBRARY = "${prisma-engines}/lib/libquery_engine.node";
          PRISMA_INTROSPECTION_ENGINE_BINARY = "${prisma-engines}/bin/introspection-engine";
          PRISMA_FMT_BINARY = "${prisma-engines}/bin/prisma-fmt";

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
