import pdfplumber
import re
import pytesseract
from pathlib import Path

pdf_path = Path('/Users/nabiljlaiel/Desktop/nuancier-peinture-epoxy-matest-2.pdf')
pattern = re.compile(r'RAL\s*\d{4}(?:\s*(?:SABL[ÉE]?|MAT|BRILLANT|SP[ÉE]CIALES?))?', re.IGNORECASE)
config = "--oem 3 --psm 6 -c tessedit_char_whitelist=RAL0123456789SABLMÉÉMATSPCIALES"

with pdfplumber.open(pdf_path) as pdf:
    for page_num, page in enumerate(pdf.pages, start=1):
        img = page.to_image(resolution=600).original
        text = pytesseract.image_to_string(img, lang='fra+eng', config=config)
        tokens = pattern.findall(text)
        entries = []
        for t in tokens:
            parts = t.upper().replace('RAL', '').strip().split()
            code = parts[0]
            finish = 'brillant'
            if len(parts) > 1:
                word = parts[1]
                if word.startswith('SABL'):
                    finish = 'sablé'
                elif word.startswith('MAT'):
                    finish = 'mat'
                elif word.startswith('SP'):
                    finish = 'spéciale'
            entries.append({'ral': code, 'finish': finish})
        seen = set()
        unique = []
        for e in entries:
            key = (e['ral'], e['finish'])
            if key not in seen:
                seen.add(key)
                unique.append(e)
        print(f"PAGE {page_num}: {len(unique)} entrées")
        print(unique)
        print('---')
