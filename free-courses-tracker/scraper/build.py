"""
build.py — Dynamically injects ALL values from courses.json into index.html
============================================================================
Nothing is hardcoded. Every number, platform pill, and category
is calculated from the actual data at build time.

Run after scraper.py:
  python scraper/build.py

GitHub Actions runs both automatically every day.
"""

import json
from pathlib import Path
from datetime import datetime, timezone

ROOT      = Path(__file__).parent.parent
DATA_FILE = ROOT / "data" / "courses.json"
TEMPLATE  = ROOT / "index.template.html"
OUTPUT    = ROOT / "index.html"

# ── Platform colours (extend this as new platforms appear) ──────────────────
PLATFORM_COLOURS = {
    "Google":                "#4285f4",
    "DeepLearning.AI":       "#e23b40",
    "Coursera":              "#0056d2",
    "edX":                   "#02262b",
    "freeCodeCamp":          "#006400",
    "Microsoft Learn":       "#00a4ef",
    "AWS Training":          "#ff9900",
    "Cisco":                 "#1ba0d7",
    "Khan Academy":          "#1b9e1b",
    "Udemy":                 "#a435f0",
    "Canva":                 "#7b2ff7",
    "Figma":                 "#f24e1e",
    "University of Helsinki":"#003580",
    "The Odin Project":      "#106113",
    "Scrimba":               "#7c3aed",
}

# Label overrides — shorten long names for the pill UI
PLATFORM_LABELS = {
    "Microsoft Learn":        "Microsoft",
    "AWS Training":           "AWS",
    "University of Helsinki": "Univ. Helsinki",
    "The Odin Project":       "Odin Project",
    "DeepLearning.AI":        "DeepLearning.AI",
}

def pill_html(platform):
    colour = PLATFORM_COLOURS.get(platform, "#6b7280")
    label  = PLATFORM_LABELS.get(platform, platform)
    dot    = f'<span class="rd-dot" style="background:{colour}"></span>'
    return (
        f'<button class="rd-pp" onclick="rdPlat(\'{platform}\',this)">'
        f'{dot}{label}</button>'
    )

def main():
    # ── Load data ────────────────────────────────────────────────────────────
    with open(DATA_FILE, encoding="utf-8") as f:
        courses = json.load(f)

    if not courses:
        print("ERROR: courses.json is empty — aborting build.")
        return

    # ── Calculate all stats from actual data ─────────────────────────────────
    total_count    = len(courses)
    free_count     = sum(1 for c in courses if c.get("price","").lower() == "free")
    trial_count    = sum(1 for c in courses if c.get("price","").lower() == "free trial")
    discounted_count = sum(1 for c in courses
                          if c.get("price","").lower() not in ("free","free trial",""))
    build_date     = datetime.now(timezone.utc).strftime("%-d %b %Y")

    # Unique platforms, ordered: known ones first, then any new ones alphabetically
    known_order = list(PLATFORM_COLOURS.keys())
    all_platforms = sorted(set(c["platform"] for c in courses if c.get("platform")))
    ordered_platforms = [p for p in known_order if p in all_platforms] + \
                        [p for p in all_platforms if p not in known_order]
    platform_count = len(ordered_platforms)

    # Category list from actual data (for the dropdown)
    all_categories = sorted(set(c["category"] for c in courses if c.get("category")))

    # ── Build platform pills HTML ─────────────────────────────────────────────
    pills_html = '\n      '.join(pill_html(p) for p in ordered_platforms)

    # ── Build category options HTML ───────────────────────────────────────────
    cat_icons = {
        "Programming":    "💻",
        "AI & ML":        "🤖",
        "Design":         "🎨",
        "Business & Data":"📊",
    }
    cat_options = "\n".join(
        f'        <option value="{c}">{cat_icons.get(c,"")} {c}</option>'
        for c in all_categories
    )

    # ── Inline the courses as JS ──────────────────────────────────────────────
    # ── Load template ─────────────────────────────────────────────────────────
    with open(TEMPLATE, encoding="utf-8") as f:
        html = f.read()

    # ── Replace every placeholder ─────────────────────────────────────────────
    replacements = {
        # Counts removed — browser calculates these live from fetched data
        # so they are always accurate regardless of when index.html was built.
        # "__BUILD_DATE__" removed — browser calculates from scraped_at in fetched data
        "__PLATFORM_PILLS__":    pills_html,
        "__CATEGORY_OPTIONS__":  cat_options,
    }

    for placeholder, value in replacements.items():
        html = html.replace(placeholder, value)

    # ── Safety check — warn if any placeholder was missed ────────────────────
    import re
    # These are intentionally handled by the browser at runtime, not build time
    browser_handled = {'__TOTAL_COUNT__', '__FREE_COUNT__', '__PLATFORM_COUNT__',
                       '__TRIAL_COUNT__', '__DISCOUNTED_COUNT__', '__BUILD_DATE__'}
    missed = set(re.findall(r'__[A-Z_]+__', html)) - browser_handled
    if missed:
        print(f"WARNING: unreplaced placeholders found: {missed}")
    else:
        print("✅ All build-time placeholders replaced cleanly.")

    # ── Write output ──────────────────────────────────────────────────────────
    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write(html)

    print("=" * 52)
    print("  ✅ Build complete")
    print(f"  Courses:     {total_count} total")
    print(f"  Free:        {free_count}")
    print(f"  Free trial:  {trial_count}")
    print(f"  Discounted:  {discounted_count}")
    print(f"  Platforms:   {platform_count}  {ordered_platforms}")
    print(f"  Categories:  {all_categories}")
    print(f"  Updated:     {build_date}")
    print(f"  Output:      {OUTPUT}")
    print("=" * 52)

if __name__ == "__main__":
    main()
