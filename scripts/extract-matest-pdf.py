import pdfplumber
import re
import json
import unicodedata
from pathlib import Path

pdf_path = Path('/Users/nabiljlaiel/Desktop/nuancier-peinture-epoxy-matest-2.pdf')

entries = []
with pdfplumber.open(pdf_path) as pdf:
    for page_num, page in enumerate(pdf.pages, start=1):
        text = page.extract_text() or ''
        for line in text.splitlines():
            if 'RAL' in line:
                parts = re.split(r'(RAL\s*\d{4}(?:\s*\w+)?)', line)
                for part in parts:
                    part = part.strip()
                    if part.upper().startswith('RAL '):
                        entries.append({'page': page_num, 'raw': part})

normalized = []
for e in entries:
    raw = e['raw'].upper().replace('RAL', '').strip()
    tokens = raw.split()
    code = tokens[0]
    finish = tokens[1].lower() if len(tokens) > 1 else 'brillant'
    finish = unicodedata.normalize('NFKD', finish).encode('ascii', 'ignore').decode('ascii')
    if finish in {'sable', 'sablee', 'sablee'}:
        finish = 'sablé'
    elif finish == 'mat':
        finish = 'mat'
    else:
        finish = 'brillant'
    normalized.append({'ral': code, 'finish': finish})

seen = set()
unique = []
for item in normalized:
    key = (item['ral'], item['finish'])
    if key not in seen:
        seen.add(key)
        unique.append(item)

print('TOTAL UNIQUE:', len(unique))
print(json.dumps(unique, indent=2, ensure_ascii=False))
