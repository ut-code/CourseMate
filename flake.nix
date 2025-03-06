{
  description = "CourseMate";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/release-24.11";

    nixpkgs-unstable.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    prisma-utils = {
      url = "github:VanCoding/nix-prisma-utils";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    nixpkgs,
    flake-utils,
    rust-overlay,
    prisma-utils,
    nixpkgs-unstable,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      overlays = [(import rust-overlay)];
      pkgs = import nixpkgs {
        inherit system overlays;
      };
      unstable = nixpkgs-unstable.legacyPackages.${system};

      rust-bin = pkgs.rust-bin.fromRustupToolchainFile ./scraper/rust-toolchain.toml;
      prisma = pkgs.callPackage ./server/prisma.nix {inherit prisma-utils;};

      common = {
        packages =
          (with pkgs; [
            nix # HACK: to fix the side effect of the hack below, installing two instances of nix
            flyctl
            gnumake
            nodejs
            biome
            lefthook
            dotenv-cli
          ])
          ++ (with unstable; [
            bun
          ]);

        env =
          prisma.env
          // {
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
