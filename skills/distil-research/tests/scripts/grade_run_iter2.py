#!/usr/bin/env python3
"""Iter-2 grader. Reuses iter-1 grading.py logic; adds new assertions for:
- manifest_files_have_contribution_type
- manifest_valid_contribution_types
- playbook_size_in_range_or_justified (replaces playbook_size_in_range)
- operator_first_present
- grades_have_confidence
- filename_normalisation_section_present
- recommendations_have_confidence
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path


def find_research_folder(run_dir: Path):
    for name in ("research-copy", "research-sandbox"):
        candidate = run_dir / name
        if candidate.is_dir():
            return candidate
    return None


def count_files_recursive(folder: Path) -> int:
    if not folder.exists():
        return 0
    return sum(
        1
        for p in folder.rglob("*")
        if p.is_file() and not any(part.startswith(".") for part in p.parts)
    )


VALID_VERDICTS = {"kept", "partial", "archived", "quarantined"}
VALID_CONTRIBUTION_TYPES = {
    "canonical_source",
    "supporting_signal",
    "partial_extract",
    "superseded_duplicate",
    "low_signal",
    "ambiguous",
}

ORIGINAL_FILE_COUNTS = {
    "agent commerce": 8,
    "Google Gemini": 5,
    "CLAUDE CO WORK": 5,
}


def grade_topic_run(run_dir: Path, eval_meta: dict, original_count: int) -> list[dict]:
    research = find_research_folder(run_dir)
    outputs = run_dir / "outputs"
    results = []

    if research is None:
        return [{"text": "research folder missing", "passed": False, "evidence": str(run_dir)}]

    distilled = research / "_distilled"
    archive = research / "_archive"
    playbook_path = distilled / "playbook.md"
    manifest_path = distilled / "manifest.json"
    run_report_path = outputs / "run-report.md"

    manifest = None
    if manifest_path.exists():
        try:
            manifest = json.loads(manifest_path.read_text())
        except json.JSONDecodeError:
            manifest = None

    for assertion in eval_meta["assertions"]:
        aid = assertion["id"]
        text = assertion["text"]
        passed = False
        evidence = ""

        if aid == "playbook_exists":
            passed = playbook_path.exists()
            evidence = str(playbook_path) if passed else "missing"
        elif aid == "manifest_exists":
            passed = manifest_path.exists()
            evidence = str(manifest_path) if passed else "missing"
        elif aid == "manifest_valid_json":
            required = {"topic", "last_run", "run_mode", "files", "playbook_sections"}
            if manifest and required.issubset(manifest.keys()):
                passed = True
                evidence = "all top-level fields present"
            else:
                evidence = f"missing: {required - set(manifest.keys())}" if manifest else "unparseable"
        elif aid == "manifest_files_have_reason":
            if manifest and isinstance(manifest.get("files"), list):
                missing = [f.get("path", "?") for f in manifest["files"] if not f.get("reason")]
                passed = not missing
                evidence = f"all {len(manifest['files'])} have reason" if passed else f"missing: {missing[:3]}"
            else:
                evidence = "manifest.files missing"
        elif aid == "manifest_files_have_contribution_type":
            if manifest and isinstance(manifest.get("files"), list):
                missing = [f.get("path", "?") for f in manifest["files"] if not f.get("contribution_type")]
                passed = not missing
                evidence = f"all {len(manifest['files'])} have contribution_type" if passed else f"missing: {missing[:3]}"
            else:
                evidence = "manifest.files missing"
        elif aid == "manifest_valid_verdicts":
            if manifest and isinstance(manifest.get("files"), list):
                bad = [(f.get("path"), f.get("verdict")) for f in manifest["files"] if f.get("verdict") not in VALID_VERDICTS]
                passed = not bad
                evidence = "all verdicts valid" if passed else f"bad: {bad[:3]}"
            else:
                evidence = "manifest.files missing"
        elif aid == "manifest_valid_contribution_types":
            if manifest and isinstance(manifest.get("files"), list):
                bad = [
                    (f.get("path"), f.get("contribution_type"))
                    for f in manifest["files"]
                    if f.get("contribution_type") not in VALID_CONTRIBUTION_TYPES
                ]
                passed = not bad
                evidence = "all contribution_types valid" if passed else f"bad: {bad[:3]}"
            else:
                evidence = "manifest.files missing"
        elif aid == "at_least_one_archived":
            n = count_files_recursive(archive) if archive.exists() else 0
            passed = n >= 1
            evidence = f"_archive/ has {n}"
        elif aid == "at_least_one_kept":
            if manifest and isinstance(manifest.get("files"), list):
                kept = [f for f in manifest["files"] if f.get("verdict") in ("kept", "partial")]
                passed = len(kept) >= 1
                evidence = f"{len(kept)} kept/partial"
            else:
                evidence = "manifest.files missing"
        elif aid == "no_files_deleted":
            final = count_files_recursive(research)
            distilled_n = count_files_recursive(distilled) if distilled.exists() else 0
            net = final - distilled_n
            passed = net == original_count
            evidence = f"orig={original_count}, final-excl-_distilled={net}"
        elif aid == "playbook_size_in_range_or_justified":
            if playbook_path.exists():
                size = playbook_path.stat().st_size
                if size <= 8192:
                    passed = True
                    evidence = f"size={size} bytes (≤8KB)"
                else:
                    justification = manifest.get("playbook_size_justification") if manifest else None
                    passed = bool(justification)
                    evidence = f"size={size} bytes (>8KB); justification={justification!r}"
            else:
                evidence = "playbook missing"
        elif aid == "no_inline_citations":
            if playbook_path.exists():
                text_c = playbook_path.read_text()
                patterns = [r"\[source:[^\]]+\]", r"\(from [\w\-]+\.md\)", r"\(see [\w\-]+\.md\)", r"Source: [\w\-]+\.md"]
                hits = [p for p in patterns if re.search(p, text_c, re.IGNORECASE)]
                passed = not hits
                evidence = "clean" if passed else f"matched: {hits}"
            else:
                evidence = "playbook missing"
        elif aid == "operator_first_present":
            if playbook_path.exists():
                text_c = playbook_path.read_text()
                n_rule_markers = len(re.findall(r"\*\*Rule:\*\*", text_c))
                passed = n_rule_markers >= 3
                evidence = f"{n_rule_markers} '**Rule:**' markers"
            else:
                evidence = "playbook missing"
        elif aid == "run_report_complete":
            if run_report_path.exists():
                report = run_report_path.read_text().lower()
                kws = ["files reviewed", "files kept", "files archived", "quarantin", "playbook size", "low-confidence", "self-assessment"]
                miss = [k for k in kws if k not in report]
                passed = not miss
                evidence = "all sections present" if passed else f"missing: {miss}"
            else:
                evidence = "run-report.md missing"

        results.append({"text": text, "passed": passed, "evidence": evidence})

    return results


def grade_housekeeping_run(run_dir: Path, eval_meta: dict, original_counts: dict) -> list[dict]:
    research = find_research_folder(run_dir)
    outputs = run_dir / "outputs"
    results = []

    if research is None:
        return [{"text": "research sandbox missing", "passed": False, "evidence": str(run_dir)}]

    overlap_report = research / "_overlap-report.md"
    run_report_path = outputs / "run-report.md"
    report_text = overlap_report.read_text() if overlap_report.exists() else ""

    for assertion in eval_meta["assertions"]:
        aid = assertion["id"]
        text = assertion["text"]
        passed = False
        evidence = ""

        if aid == "overlap_report_exists":
            passed = overlap_report.exists()
            evidence = str(overlap_report) if passed else "missing"
        elif aid == "report_has_grades":
            hits = re.findall(r"\b[A-F][+-]?\b", report_text)
            passed = len(hits) >= 3
            evidence = f"{len(hits)} grade-like tokens"
        elif aid == "report_separates_auto_and_proposed":
            lower = report_text.lower()
            has_auto = ("auto-action" in lower or "auto-move" in lower or ("auto" in lower and "action" in lower))
            has_proposed = "propos" in lower or "awaiting" in lower
            passed = has_auto and has_proposed
            evidence = f"auto={has_auto}, proposed={has_proposed}"
        elif aid == "conservative_auto_moves":
            current_counts = {}
            for td in research.iterdir():
                if td.is_dir() and not td.name.startswith("_"):
                    current_counts[td.name] = count_files_recursive(td)
            changes = {t: current_counts.get(t, 0) - original_counts.get(t, 0) for t in original_counts}
            total_moves = sum(abs(v) for v in changes.values()) // 2
            passed = total_moves <= 2
            evidence = f"net moves: {changes} (~{total_moves})"
        elif aid == "no_files_deleted":
            current_total = count_files_recursive(research)
            new_artifacts = 1 if overlap_report.exists() else 0
            net = current_total - new_artifacts
            original_total = sum(original_counts.values())
            passed = net == original_total
            evidence = f"orig={original_total}, current(excl new)={net}"
        elif aid == "two_post_files_compared":
            passed = "i came accross" in report_text.lower()
            evidence = "report references the post files" if passed else "no mention"
        elif aid == "grades_have_confidence":
            # look for confidence labels near grades — e.g., "B | high" or "B (confidence: high)" or in a row
            passed = bool(re.search(r"confidence[:|\s]+(high|medium|low)", report_text, re.IGNORECASE))
            evidence = "found confidence labels" if passed else "no confidence column on grades"
        elif aid == "filename_normalisation_section_present":
            lower = report_text.lower()
            passed = "filename normalisation" in lower or "filename normalization" in lower
            evidence = "section present" if passed else "section absent"
        elif aid == "recommendations_have_confidence":
            # Find the recommendations section heading and take everything from there
            # to the next ## heading (or end of doc) — that's the recommendations area.
            lower = report_text.lower()
            match = re.search(r"##\s+\d*\.?\s*recommendations?\b", lower)
            if match:
                start = match.end()
                next_h = re.search(r"\n##\s+", lower[start:])
                recs_section = lower[start : start + next_h.start()] if next_h else lower[start:]
                n_confidence_in_recs = len(re.findall(r"\b(high|medium|low)\b", recs_section))
                passed = n_confidence_in_recs >= 2
                evidence = f"{n_confidence_in_recs} confidence labels inside Recommendations section"
            else:
                passed = False
                evidence = "no Recommendations section heading found"
        elif aid == "run_report_complete":
            if run_report_path.exists():
                report = run_report_path.read_text().lower()
                kws = ["topics reviewed", "files reviewed", "grade", "overlap", "auto", "propos", "low-confidence", "self-assessment"]
                miss = [k for k in kws if k not in report]
                passed = not miss
                evidence = "all sections present" if passed else f"missing: {miss}"
            else:
                evidence = "run-report.md missing"

        results.append({"text": text, "passed": passed, "evidence": evidence})

    return results


def main():
    if len(sys.argv) != 2:
        print("usage: grade_run_iter2.py <run-dir>", file=sys.stderr)
        sys.exit(1)
    run_dir = Path(sys.argv[1]).resolve()
    eval_meta_path = run_dir.parent / "eval_metadata.json"
    eval_meta = json.loads(eval_meta_path.read_text())

    if eval_meta["eval_id"] in (0, 1):
        topic = "agent commerce" if eval_meta["eval_id"] == 0 else "Google Gemini"
        results = grade_topic_run(run_dir, eval_meta, ORIGINAL_FILE_COUNTS[topic])
    else:
        results = grade_housekeeping_run(run_dir, eval_meta, ORIGINAL_FILE_COUNTS)

    grading = {"expectations": results}
    (run_dir / "grading.json").write_text(json.dumps(grading, indent=2))
    passed = sum(1 for r in results if r["passed"])
    print(f"{run_dir.name}: {passed}/{len(results)} assertions passed")
    for r in results:
        if not r["passed"]:
            print(f"  FAIL: {r['text']} — {r['evidence']}")


if __name__ == "__main__":
    main()
