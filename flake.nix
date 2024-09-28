{
  description = "CourseMate";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/master";
    flake-utils.url = "github:numtide/flake-utils";
    prisma-utils.url = "github:VanCoding/nix-prisma-utils";
  };

  outputs = { nixpkgs, flake-utils, prisma-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };

        prisma = (prisma-utils.lib.prisma-factory {
          nixpkgs = pkgs;
          prisma-fmt-hash = "sha256-atD5GZfmeU86mF1V6flAshxg4fFR2ews7EwaJWZZzbc="; # just copy these hashes for now, and then change them when nix complains about the mismatch
          query-engine-hash = "sha256-8FTZaKmQCf9lrDQvkF5yWPeZ7TSVfFjTbjdbWWEHgq4=";
          libquery-engine-hash = "sha256-USIdaum87ekGY6F6DaL/tKH0BAZvHBDK7zjmCLo//kM=";
          schema-engine-hash = "sha256-k5MkxXViEqojbkkcW/4iBFNdfhb9PlMEF1M2dyhfOok=";
        }).fromNpmLock
          ./server/package-lock.json; # <--- path to our package-lock.json file that contains the version of prisma-engines
      in
      {
        devShell = pkgs.mkShell {
          src = ./.;
          nativeBuildInputs = with pkgs; [ bashInteractive ];
          buildInputs = with pkgs; [
            gnumake
            bun
            biome
          ];
          shellHook = prisma.shellHook;
        };
      });
}
