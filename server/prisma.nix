{
  prisma-utils,
  pkgs,
}: let
  prisma =
    (prisma-utils.lib.prisma-factory
      {
        nixpkgs = pkgs;
        # just copy these hashes for now, and then change them when nix complains about the mismatch
        prisma-fmt-hash = "sha256-0PSvJ2tB5pBS7k65qsF2MCV3s06orrDYDkaC5jnfbPU=";
        query-engine-hash = "sha256-G2iumxi4HMqcSdmYm+KAlj0k2haX9EE9bh7CScdX7lU=";
        libquery-engine-hash = "sha256-Uxs7CWqxgBhOivn495YkndEsrG55hHpYrNjdCeUrqwk=";
        schema-engine-hash = "sha256-08sTw6io+Cyx5O2Mnk/yflAcgzZYxMOPGGSM6OLzqRA=";
      })
    .fromNpmLock
    ./package-lock.json;
  inherit (prisma) package;
in {
  inherit (prisma) shellHook;
  env = {
    # required by prisma
    PRISMA_QUERY_ENGINE_BINARY = "${package}/bin/query-engine";
    PRISMA_QUERY_ENGINE_LIBRARY = "${package}/lib/libquery_engine.node";
    PRISMA_INTROSPECTION_ENGINE_BINARY = "${package}/bin/introspection-engine";
    PRISMA_SCHEMA_ENGINE_BINARY = "${package}/bin/schema-engine";
  };
}
