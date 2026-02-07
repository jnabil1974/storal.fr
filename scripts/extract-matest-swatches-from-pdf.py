import os
import cv2
import numpy as np
import pdfplumber
from pathlib import Path

BASE_DIR = Path('/Applications/MAMP/htdocs/store_menuiserie')
PDF_PATH = Path('/Users/nabiljlaiel/Desktop/nuancier-peinture-epoxy-matest-2.pdf')
OUT_DIR = BASE_DIR / 'public' / 'images' / 'matest' / 'pdf-thumbs'

OUT_DIR.mkdir(parents=True, exist_ok=True)

# Expected swatches per page
EXPECTED = {1: 26, 2: 26, 3: 28}


def extract_swatches(page_image, expected_count, page_num):
    img = cv2.cvtColor(np.array(page_image), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blur, 50, 150)

    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    boxes = []
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        area = w * h
        if area < 5000:
            continue
        if w < 50 or h < 50:
            continue
        # filter extreme aspect ratios
        ratio = w / float(h)
        if ratio < 0.6 or ratio > 1.8:
            continue
        boxes.append((x, y, w, h, area))

    # Sort by area desc and keep top candidates
    boxes = sorted(boxes, key=lambda b: b[4], reverse=True)

    # Heuristic: keep boxes around the median size
    if boxes:
        areas = np.array([b[4] for b in boxes])
        med = np.median(areas)
        filtered = [b for b in boxes if 0.5 * med <= b[4] <= 2.0 * med]
    else:
        filtered = []

    # If still too many, take top N by area
    if len(filtered) > expected_count * 2:
        filtered = filtered[: expected_count * 2]

    # Sort top-to-bottom, left-to-right
    filtered = sorted(filtered, key=lambda b: (b[1], b[0]))

    # If still more than expected, take first expected
    if len(filtered) >= expected_count:
        filtered = filtered[:expected_count]

    swatches = []
    for idx, (x, y, w, h, _) in enumerate(filtered, start=1):
        pad = 3
        x1 = max(x + pad, 0)
        y1 = max(y + pad, 0)
        x2 = min(x + w - pad, img.shape[1])
        y2 = min(y + h - pad, img.shape[0])
        crop = img[y1:y2, x1:x2]
        swatches.append((idx, crop))

    return swatches


with pdfplumber.open(PDF_PATH) as pdf:
    for page_num, expected in EXPECTED.items():
        page = pdf.pages[page_num - 1]
        image = page.to_image(resolution=300).original
        swatches = extract_swatches(image, expected, page_num)
        page_dir = OUT_DIR / f'page-{page_num}'
        page_dir.mkdir(parents=True, exist_ok=True)

        for idx, crop in swatches:
            out_path = page_dir / f'color_{idx:02d}.png'
            cv2.imwrite(str(out_path), crop)

        print(f'Page {page_num}: extracted {len(swatches)} swatches (expected {expected}) -> {page_dir}')

print('Done.')
