{ fenix, system }:
fenix.packages.${system}.fromToolchainFile {
  file = ../scraper/rust-toolchain.toml;
  sha256 = "sha256-yMuSb5eQPO/bHv+Bcf/US8LVMbf/G/0MSfiPwBhiPpk=";
}
