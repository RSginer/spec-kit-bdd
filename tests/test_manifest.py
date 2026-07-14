import re
from pathlib import Path
import pytest
import yaml

EXTENSION_YML = Path("extension.yml")
COMMANDS_DIR = Path("commands")


def load_manifest():
    return yaml.safe_load(EXTENSION_YML.read_text())


def test_manifest_file_exists():
    assert EXTENSION_YML.exists(), "extension.yml must exist at project root"


def test_schema_version():
    assert load_manifest()["schema_version"] == "1.0"


def test_extension_id():
    ext = load_manifest()["extension"]
    assert ext["id"] == "bdd"
    assert re.match(r"^[a-z0-9-]+$", ext["id"])


def test_extension_version_is_semver():
    version = load_manifest()["extension"]["version"]
    assert re.match(r"^\d+\.\d+\.\d+$", version), f"'{version}' is not semver"


def test_required_extension_fields():
    ext = load_manifest()["extension"]
    for field in ("id", "name", "version", "description", "author", "license"):
        assert field in ext, f"extension.{field} is required"


def test_description_length():
    desc = load_manifest()["extension"]["description"]
    assert len(desc) <= 200, "description must be <= 200 characters"


def test_speckit_version_constraint():
    constraint = load_manifest()["requires"]["speckit_version"]
    assert ">=" in constraint, "speckit_version must have a >= lower bound"


def test_all_three_commands_registered():
    commands = load_manifest()["provides"]["commands"]
    names = {c["name"] for c in commands}
    assert names == {
        "speckit.bdd.scenarios",
        "speckit.bdd.scaffold",
        "speckit.bdd.verify",
    }


def test_command_names_match_pattern():
    pattern = re.compile(r"^speckit\.[a-z0-9-]+\.[a-z0-9-]+$")
    for cmd in load_manifest()["provides"]["commands"]:
        assert pattern.match(cmd["name"]), f"'{cmd['name']}' violates naming pattern"


def test_each_command_has_description():
    for cmd in load_manifest()["provides"]["commands"]:
        assert cmd.get("description"), f"Command '{cmd['name']}' needs a description"


def test_command_files_exist():
    for cmd in load_manifest()["provides"]["commands"]:
        path = Path(cmd["file"])
        assert path.exists(), f"Command file '{cmd['file']}' declared but not found"


def test_hooks_after_specify_present():
    hooks = load_manifest().get("hooks", {})
    assert "after_specify" in hooks, "after_specify hook is required"


def test_hooks_before_implement_present():
    hooks = load_manifest().get("hooks", {})
    assert "before_implement" in hooks, "before_implement hook is required"


def test_tags_present():
    tags = load_manifest().get("tags", [])
    assert len(tags) >= 2, "At least 2 tags are required for catalog discoverability"
