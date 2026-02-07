import pdfplumber
import re
import pytesseract
from pathlib import Path

pdf_path = Path('/Users/nabiljlaiel/Desktop/nuancier-peinture-epoxy-matest-2.pdf')

pages_to_check = [3, 4]
config = "--oem 3 --psm 6"

with pdfplumber.open(pdf_path) as pdf:
    for page_num in pages_to_check:
        page = pdf.pages[page_num - 1]
        img = page.to_image(resolution=1200).original
        text = pytesseract.image_to_string(img, lang='fra+eng', config=config)
        # Find 4-digit codes
        codes = re.findall(r'\b\d{4}\b', text)
        unique = []
        seen = set()
        for c in codes:
            if c not in seen:
                seen.add(c)
                unique.append(c)
        print(f"PAGE {page_num} codes:")
        print(unique)
        print('---')
