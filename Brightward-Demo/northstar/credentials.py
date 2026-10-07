"""Save a project key locally through a hidden terminal prompt."""
import getpass
import os
import sys
import tempfile

from .settings import KEY_FILE, PROJECT_ID


def main():
    if not sys.stdin.isatty():
        raise SystemExit("Run this command in an interactive terminal; the key prompt is hidden.")
    key = getpass.getpass(f"API key for Brightward ({PROJECT_ID}): ").strip()
    if not key:
        raise SystemExit("No key entered; the existing configuration was retained.")
    KEY_FILE.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(prefix=".api-key-", dir=KEY_FILE.parent)
    try:
        with os.fdopen(fd, "w") as stream:
            stream.write(key + "\n")
        os.replace(temporary, KEY_FILE)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)
    print("Project key saved privately. It is not served by the app or included in source packages.")


if __name__ == "__main__":
    main()
