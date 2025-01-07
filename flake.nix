{
  description = "CourseMate";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/release-24.11";
    unstable.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

    flake-utils.url = "github:numtide/flake-utils";
    fenix = {
      url = "github:nix-community/fenix/monthly";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { nixpkgs, unstable, flake-utils, fenix, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        unstable-pkgs = unstable.legacyPackages.${system};
        rust-pkgs = import ./nix/rust-toolchain.nix { inherit fenix system; };

        common = {
          buildInputs = with pkgs; [
            gnumake
            bun
            biome
            lefthook
            dotenv-cli
            unstable-pkgs.prisma
          ];

          shellHook = ''
            # requird by prisma
            export PRISMA_QUERY_ENGINE_BINARY="${unstable-pkgs.prisma-engines}/bin/query-engine";
            export PRISMA_QUERY_ENGINE_LIBRARY="${unstable-pkgs.prisma-engines}/lib/libquery_engine.node";
            export PRISMA_INTROSPECTION_ENGINE_BINARY="${unstable-pkgs.prisma-engines}/bin/introspection-engine";
            export PRISMA_FMT_BINARY="${unstable-pkgs.prisma-engines}/bin/prisma-fmt";
          '';
        };
      in
      {
        devShells.default = pkgs.mkShell common;
        devShells.scraper = pkgs.mkShell {
          buildInputs = common.buildInputs ++ (with pkgs; [
            pkg-config
            openssl
            rust-pkgs
          ]);
          shellHook = common.shellHook;
        };
      });
}

