from pathlib import Path
import pytest
import yaml

COMMANDS_DIR = Path("commands")


def read_command(filename: str) -> str:
    path = COMMANDS_DIR / filename
    assert path.exists(), f"commands/{filename} must exist"
    return path.read_text()


def parse_frontmatter(content: str) -> tuple[dict, str]:
    if not content.startswith("---"):
        return {}, content
    end = content.index("---", 3)
    fm = yaml.safe_load(content[3:end])
    body = content[end + 3:].strip()
    return fm, body


class TestScenariosCommand:
    def test_file_exists(self):
        assert (COMMANDS_DIR / "scenarios.md").exists()

    def test_has_description_in_frontmatter(self):
        fm, _ = parse_frontmatter(read_command("scenarios.md"))
        assert "description" in fm and len(fm["description"]) > 10

    def test_references_specify_artifact(self):
        content = read_command("scenarios.md")
        assert ".specify" in content, "Must reference the .specify/ artifact directory"

    def test_references_features_directory(self):
        content = read_command("scenarios.md")
        assert "features/" in content, "Must tell the agent to write to features/"

    def test_mentions_gherkin_keywords(self):
        content = read_command("scenarios.md")
        for keyword in ("Given", "When", "Then", "Feature", "Scenario"):
            assert keyword in content, f"Must mention Gherkin keyword '{keyword}'"

    def test_mentions_happy_path_and_edge_cases(self):
        content = read_command("scenarios.md").lower()
        assert "happy" in content or "success" in content
        assert "edge" in content or "error" in content

    def test_mentions_scenario_outline(self):
        content = read_command("scenarios.md")
        assert "Scenario Outline" in content or "scenario outline" in content.lower()

    def test_has_arguments_placeholder(self):
        assert "$ARGUMENTS" in read_command("scenarios.md")


class TestScaffoldCommand:
    def test_file_exists(self):
        assert (COMMANDS_DIR / "scaffold.md").exists()

    def test_has_description_in_frontmatter(self):
        fm, _ = parse_frontmatter(read_command("scaffold.md"))
        assert "description" in fm and len(fm["description"]) > 10

    def test_references_features_directory(self):
        content = read_command("scaffold.md")
        assert "features/" in content

    def test_mentions_step_definitions(self):
        content = read_command("scaffold.md").lower()
        assert "step" in content and ("definition" in content or "stub" in content)

    def test_supports_multiple_languages(self):
        content = read_command("scaffold.md")
        languages = ("Python", "JavaScript", "Ruby", "Java", "C#")
        found = sum(1 for lang in languages if lang in content)
        assert found >= 3, f"Must support ≥3 languages, found {found}"

    def test_mentions_language_detection(self):
        content = read_command("scaffold.md").lower()
        assert "detect" in content or "package.json" in content or "requirements.txt" in content

    def test_mentions_pending_implementation(self):
        content = read_command("scaffold.md")
        assert "TODO" in content or "NotImplementedError" in content or "pending" in content.lower()

    def test_has_arguments_placeholder(self):
        assert "$ARGUMENTS" in read_command("scaffold.md")


class TestVerifyCommand:
    def test_file_exists(self):
        assert (COMMANDS_DIR / "verify.md").exists()

    def test_has_description_in_frontmatter(self):
        fm, _ = parse_frontmatter(read_command("verify.md"))
        assert "description" in fm and len(fm["description"]) > 10

    def test_references_specify_artifact(self):
        content = read_command("verify.md")
        assert ".specify" in content

    def test_references_features_directory(self):
        content = read_command("verify.md")
        assert "features/" in content or "feature" in content.lower()

    def test_mentions_traceability(self):
        content = read_command("verify.md").lower()
        assert "traceab" in content or "coverage" in content

    def test_mentions_traceability_matrix_output(self):
        content = read_command("verify.md")
        assert "TRACEABILITY.md" in content or "traceability matrix" in content.lower()

    def test_mentions_coverage_percentage(self):
        content = read_command("verify.md").lower()
        assert "%" in content or "percent" in content or "coverage" in content

    def test_mentions_uncovered_requirements(self):
        content = read_command("verify.md").lower()
        assert "uncovered" in content or "missing" in content or "gap" in content

    def test_has_arguments_placeholder(self):
        assert "$ARGUMENTS" in read_command("verify.md")
