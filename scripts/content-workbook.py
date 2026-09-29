"""Build the fillable content workbook from the generated inventory CSVs.

Run `node scripts/content-inventory.mjs` first — that reads the typed runtime
and writes docs/content/*.csv. This only dresses those CSVs for filling in:
frozen headers, filters, wrapped text, and yellow on every cell a person is
meant to type into.

    python3 scripts/content-workbook.py
"""

import csv
import pathlib

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "docs" / "content"
OUT = SRC / "PFM-drawer-content-inventory.xlsx"

FONT = "Arial"
HEADER_FILL = PatternFill("solid", fgColor="0C111D")      # PFM black
FILL_ME = PatternFill("solid", fgColor="FFFF00")          # type here
GAP_FILL = PatternFill("solid", fgColor="FDE2E1")         # a real gap
READONLY = Font(name=FONT, size=10, color="475467")
HEADER_FONT = Font(name=FONT, size=10, bold=True, color="FFFFFF")
THIN = Side(style="thin", color="E4E7EC")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

# Columns the reader fills in are prefixed in the generator, so the styling
# rule is the same everywhere and cannot drift from the data.
def is_fillable(header: str) -> bool:
    return header.startswith(("TEXT_", "ASSET_", "SOURCE_", "NOTES"))


SHEETS = [
    ("01-views.csv", "Views", "What each scene's drawer shows today. Read-only overview — nothing to fill in here."),
    ("02-capabilities.csv", "Capabilities", "Artwork and video, per SEGMENT + capability. A capability id is shared; footage is never shared."),
    ("03-implementations.csv", "Implementations", "Per supplier product. Fill once — each is reused across every scene that shows it."),
    ("04-in-practice.csv", "In practice", "Customer proof, per scene. Empty everywhere today; leaving it empty is a valid answer."),
]


def add_sheet(wb: Workbook, csv_name: str, title: str, note: str, first: bool) -> None:
    rows = list(csv.reader((SRC / csv_name).open(encoding="utf-8")))
    header, body = rows[0], rows[1:]

    ws = wb.active if first else wb.create_sheet()
    ws.title = title

    ws["A1"] = note
    ws["A1"].font = Font(name=FONT, size=10, italic=True, color="667085")
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=max(len(header), 2))

    for col, name in enumerate(header, start=1):
        cell = ws.cell(row=2, column=col, value=name)
        cell.font = HEADER_FONT
        cell.fill = HEADER_FILL
        cell.alignment = Alignment(vertical="center", wrap_text=True)
        cell.border = BORDER

    gap_col = header.index("gap") + 1 if "gap" in header else None

    for r, row in enumerate(body, start=3):
        has_gap = bool(gap_col and len(row) >= gap_col and row[gap_col - 1].strip())
        for c, value in enumerate(row, start=1):
            cell = ws.cell(row=r, column=c, value=value)
            cell.font = READONLY
            cell.alignment = Alignment(vertical="top", wrap_text=True)
            cell.border = BORDER
            if is_fillable(header[c - 1]):
                cell.fill = FILL_ME
            elif gap_col and c == gap_col and has_gap:
                cell.fill = GAP_FILL

    widths = {
        "segment": 20, "segment_id": 14, "scene_no": 9, "scene_id": 34, "scene_title": 26,
        "stage": 12, "section": 15, "shows_today": 46, "gap": 40, "depends_on": 46,
        "capability_id": 14, "capability_name": 26, "purpose": 52, "scenes_using_it": 34,
        "illustration_paths": 44, "video_path": 40, "implementation_id": 30,
        "supplier": 16, "product": 30, "role": 34, "readiness": 20, "used_in_segments": 26,
        "privacy_status": 26, "SOURCE_url_or_doc": 34,
    }
    for col, name in enumerate(header, start=1):
        width = widths.get(name, 30 if is_fillable(name) else 14)
        ws.column_dimensions[get_column_letter(col)].width = width

    ws.freeze_panes = "A3"
    ws.auto_filter.ref = f"A2:{get_column_letter(len(header))}{len(body) + 2}"


def add_legend(wb: Workbook) -> None:
    ws = wb.create_sheet(title="Read me", index=0)
    ws.column_dimensions["A"].width = 26
    ws.column_dimensions["B"].width = 110

    lines = [
        ("PFM Commercial Experience", "Drawer content inventory — \"How does this work?\""),
        ("", ""),
        ("Generated", "node scripts/content-inventory.mjs — re-run it after any content change."),
        ("Source", "The typed runtime itself, not a hand-kept list. What it says exists, exists."),
        ("", ""),
        ("HOW TO USE THIS", ""),
        ("Yellow cells", "Type here. Everything else is read from the product and will be overwritten on the next run."),
        ("Pink cells", "A real gap: something the drawer would show but has nothing to show."),
        ("Filter on 'gap'", "Every sheet has a filter on row 2. Filter 'gap' to non-blank to see only what is missing."),
        ("", ""),
        ("THE FOUR SHEETS", ""),
        ("Views", "185 rows — every scene x every section. Read-only: this is what the product does today."),
        ("Capabilities", "26 rows — artwork and video, per SEGMENT + capability. Fill the caption and the asset path."),
        ("Implementations", "23 rows — per supplier product. Fill once; it is reused everywhere that product appears."),
        ("In practice", "37 rows — customer proof per scene. All empty today."),
        ("", ""),
        ("WHY NOT ONE SHEET PER SCENE", ""),
        ("", "23 implementations render 105 times across the 37 scenes. A per-scene sheet would ask for the"),
        ("", "same sensor photograph four times over. Artwork is per segment because a capability id is shared"),
        ("", "and footage is not — TECH-01 at a retail frontage is not TECH-01 in a drive-thru lane."),
        ("", ""),
        ("LANGUAGES", ""),
        ("", "Write English only. English is the model's own wording; French and German are resolved from it,"),
        ("", "and every string is checked for all three before it can ship."),
        ("", ""),
        ("WHAT A TEXT MAY NOT SAY", ""),
        ("", "No accuracy figure, no ROI, no uplift, no payback, no benchmark, no customer result."),
        ("", "No real customer name or logo without documented approval."),
        ("", "A limitation is what the product cannot do — not a softened feature."),
        ("", "A privacy statement needs a source; without one it stays 'requires source mapping'."),
        ("", "An illustration orients and proves nothing. It is never evidence of a measurement."),
        ("", ""),
        ("EXAMPLE ROW", "Implementations sheet, for a sensor that already has everything:"),
        ("TEXT_one_limitation", "Counts people crossing a configured line; it does not identify anyone and cannot follow a visitor between entrances."),
        ("TEXT_installation_essentials", "Ceiling mount, 2.4-4.0 m; PoE; clear line of sight across the full door width."),
        ("TEXT_privacy_statement", "Processes depth images on the device and stores no image; only anonymous counts leave the sensor."),
        ("ASSET_name", "xovis-pc2-ceiling.jpg"),
        ("ASSET_path", "/assets/technology/xovis-pc2-ceiling.jpg"),
        ("SOURCE_url_or_doc", "Xovis PC2 datasheet v3.1, p. 4 — https://..."),
    ]

    for r, (left, right) in enumerate(lines, start=1):
        a = ws.cell(row=r, column=1, value=left)
        b = ws.cell(row=r, column=2, value=right)
        a.font = Font(name=FONT, size=10, bold=True, color="0C111D")
        b.font = Font(name=FONT, size=10, color="475467")
        b.alignment = Alignment(vertical="top", wrap_text=True)
        if left in {"HOW TO USE THIS", "THE FOUR SHEETS", "WHY NOT ONE SHEET PER SCENE", "LANGUAGES", "WHAT A TEXT MAY NOT SAY"}:
            a.font = Font(name=FONT, size=10, bold=True, color="6941C6")
        if left.startswith(("TEXT_", "ASSET_", "SOURCE_")):
            b.fill = FILL_ME

    ws["B1"].font = Font(name=FONT, size=14, bold=True, color="0C111D")
    ws["A1"].font = Font(name=FONT, size=14, bold=True, color="6941C6")


def main() -> None:
    wb = Workbook()
    for index, (csv_name, title, note) in enumerate(SHEETS):
        add_sheet(wb, csv_name, title, note, first=index == 0)
    add_legend(wb)
    wb.active = 0
    wb.save(OUT)
    print(f"wrote {OUT}")
    for _, title, _ in SHEETS:
        print(f"  sheet: {title}")


if __name__ == "__main__":
    main()
