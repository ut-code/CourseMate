{
  pkgs,
  prisma-utils,
}: let
  prisma =
    (prisma-utils.lib.prisma-factory
      {
        inherit pkgs;
        prisma-fmt-hash = "sha256-iZuomC/KaLF0fQy6RVHwk2qq4DRaG3xj+sWmtLofiMU=";
        query-engine-hash = "sha256-Pl/YpYu326qqpbVfczM5RxB8iWXZlewG9vToqzSPIQo=";
        libquery-engine-hash = "sha256-ETwMIJMjMgZmjH6QGD7GVwYYlyx9mo2ydEeunFViCjQ=";
        schema-engine-hash = "sha256-rzzzPHOpUM3GJvkhU08lQ7rNspdq3RKxMRRW9YZtvhU=";
      })
    .fromBunLock
    ../bun.lock;
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
