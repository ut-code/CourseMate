{
  description = "CourseMate";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/release-24.11";
    flake-utils.url = "github:numtide/flake-utils";
    prisma-utils.url = "github:VanCoding/nix-prisma-utils";
    fenix = {
      url = "github:nix-community/fenix/monthly";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { nixpkgs, flake-utils, prisma-utils, fenix, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        prisma = import ./nix/prisma.nix { inherit prisma-utils pkgs; };
        rust-pkgs = import ./nix/rust-toolchain.nix { inherit fenix system; };
      in
      {
        devShell = pkgs.mkShell {
          src = ./.;
          nativeBuildInputs = with pkgs; [ bashInteractive ];
          buildInputs = with pkgs; [
            gnumake
            bun
            biome
            pkg-config
            openssl
            lefthook
            pkgs.prisma
            dotenv-cli
          ] ++ [
            rust-pkgs
          ];
          shellHook = ''
            # no longer necessary
            # export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:${pkgs.stdenv.cc.cc.lib}/lib
          '' + prisma.shellHook;
        };
      });
}
