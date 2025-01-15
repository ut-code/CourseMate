{
  lib,
  stdenv,
  openssl,
  pkg-config,
  makeRustPlatform,
  toolchain,
}: let
  rustPlatform = makeRustPlatform {
    cargo = toolchain;
    rustc = toolchain;
  };
in
  rustPlatform.buildRustPackage {
    buildInputs = lib.lists.optional stdenv.isLinux openssl;
    nativeBuildInputs = lib.lists.optional stdenv.isLinux pkg-config;
    pname = "coursemate-scraper";
    version = "0.1.0";
    src = ./.;
    cargoLock.lockFile = ./Cargo.lock;
  }
