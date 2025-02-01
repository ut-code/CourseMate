{
  pkgs,
  prisma-utils,
}: let
  prisma =
    (prisma-utils.lib.prisma-factory
      {
        nixpkgs = pkgs;
        prisma-fmt-hash = "sha256-atD5GZfmeU86mF1V6flAshxg4fFR2ews7EwaJWZZzbc=";
        query-engine-hash = "sha256-8FTZaKmQCf9lrDQvkF5yWPeZ7TSVfFjTbjdbWWEHgq4=";
        libquery-engine-hash = "sha256-USIdaum87ekGY6F6DaL/tKH0BAZvHBDK7zjmCLo//kM=";
        schema-engine-hash = "sha256-k5MkxXViEqojbkkcW/4iBFNdfhb9PlMEF1M2dyhfOok=";
      })
    .fromBunLock
    ./bun.lock;
  inherit (prisma) package;
in {
  inherit (prisma) shellHook;

  # waiting for https://github.com/VanCoding/nix-prisma-utils/pull/10
  env = {
    PRISMA_QUERY_ENGINE_BINARY = "${package}/bin/query-engine";
    PRISMA_QUERY_ENGINE_LIBRARY = "${package}/lib/libquery_engine.node";
    PRISMA_INTROSPECTION_ENGINE_BINARY = "${package}/bin/introspection-engine";
    PRISMA_SCHEMA_ENGINE_BINARY = "${package}/bin/schema-engine";
    PRISMA_FMT_BINARY = "${package}/bin/prisma-fmt";
  };
}
