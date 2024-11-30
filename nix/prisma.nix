{ prisma-utils, pkgs }: rec {
  prisma = (prisma-utils.lib.prisma-factory {
    nixpkgs = pkgs;
    prisma-fmt-hash = "sha256-atD5GZfmeU86mF1V6flAshxg4fFR2ews7EwaJWZZzbc="; # just copy these hashes for now, and then change them when nix complains about the mismatch
    query-engine-hash = "sha256-8FTZaKmQCf9lrDQvkF5yWPeZ7TSVfFjTbjdbWWEHgq4=";
    libquery-engine-hash = "sha256-USIdaum87ekGY6F6DaL/tKH0BAZvHBDK7zjmCLo//kM=";
    schema-engine-hash = "sha256-k5MkxXViEqojbkkcW/4iBFNdfhb9PlMEF1M2dyhfOok=";
  }).fromNpmLock
    ./../server/package-lock.json; # <--- path to our package-lock.json file that contains the version of prisma-engines

  shellHook = (if pkgs.system == "x86_64-linux" then prisma.shellHook else "");
}
