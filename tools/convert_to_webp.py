#!/usr/bin/env python3
"""convert_to_webp.py

Usage:
  python scripts/convert_to_webp.py input.(jpg|png|webp) output.webp

Behavior (blog conventions):
- Converts to WebP (quality=82)
- Resizes to max width 1200px (keeps aspect ratio)
- Strips metadata
"""

from __future__ import annotations

import sys
from pathlib import Path


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: python scripts/convert_to_webp.py <input> <output.webp>")
        return 2

    src = Path(sys.argv[1])
    dst = Path(sys.argv[2])

    if not src.exists():
        print(f"Input not found: {src}")
        return 2

    try:
        from PIL import Image
    except Exception as e:
        print("Missing dependency: Pillow. Install with: pip install pillow")
        print(f"Error: {e}")
        return 2

    with Image.open(src) as im:
        # Convert to RGB to avoid WebP alpha issues in some pipelines
        if im.mode in ("RGBA", "P"):
            im = im.convert("RGBA")
        else:
            im = im.convert("RGB")

        max_w = 1200
        if im.width > max_w:
            new_h = int(im.height * (max_w / im.width))
            im = im.resize((max_w, new_h), Image.LANCZOS)

        dst.parent.mkdir(parents=True, exist_ok=True)
        im.save(dst, format="WEBP", quality=82, method=6)

    print(f"Wrote: {dst}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
