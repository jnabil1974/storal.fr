import pdfplumber
import re
import json
from pathlib import Path

pdf_path = Path('/Users/nabiljlaiel/Desktop/nuancier-peinture-epoxy-matest-2.pdf')

per_page = {}
with pdfplumber.open(pdf_path) as pdf:
    for page_num, page in enumerate(pdf.pages, start=1):
        text = page.extract_text() or ''
        tokens = re.findall(r'RAL\s*\d{4}(?:\s*(?:SABL[ÉE]?|MAT|BRILLANT|SP[ÉE]CIALES?))?', text, flags=re.IGNORECASE)
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
        per_page[page_num] = entries

print(json.dumps(per_page, indent=2, ensure_ascii=False))
