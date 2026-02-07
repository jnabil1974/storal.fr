from pathlib import Path

base_dir = Path('/Applications/MAMP/htdocs/store_menuiserie')
thumbs_dir = base_dir / 'public' / 'images' / 'matest' / 'pdf-thumbs'
output = base_dir / 'public' / 'matest-preview.html'

sections = [
    ('Brillant — Page 1 (26)', 'page-1'),
    ('Brillant — Page 2 (26)', 'page-2'),
    ('Sablé — Page 3 (28)', 'page-3'),
]

html = [
"<!doctype html>",
"<html lang=\"fr\">",
"<head>",
"  <meta charset=\"utf-8\" />",
"  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />",
"  <title>Prévisualisation nuancier Matest</title>",
"  <style>",
"    body { font-family: Arial, sans-serif; margin: 20px; }",
"    h1 { margin-bottom: 8px; }",
"    .section { margin: 24px 0; }",
"    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; }",
"    .card { border: 1px solid #ddd; border-radius: 8px; padding: 8px; text-align: center; }",
"    .thumb { width: 100%; height: 90px; object-fit: cover; border-radius: 6px; border: 1px solid #eee; }",
"    .label { margin-top: 6px; font-size: 12px; color: #555; }",
"  </style>",
"</head>",
"<body>",
"  <h1>Vignettes couleurs Matest</h1>",
"  <p>Prévisualisation des vignettes extraites depuis le PDF.</p>",
]

for title, folder in sections:
    html.append("  <div class=\"section\">")
    html.append(f"    <h2>{title}</h2>")
    html.append("    <div class=\"grid\">")
    files = sorted((thumbs_dir / folder).glob('*.png'))
    for f in files:
        rel = f"/images/matest/pdf-thumbs/{folder}/{f.name}"
        label = f.name.replace('color_', '').replace('.png', '')
        html.append("      <div class=\"card\">")
        html.append(f"        <img class=\"thumb\" src=\"{rel}\" alt=\"{label}\" />")
        html.append(f"        <div class=\"label\">{label}</div>")
        html.append("      </div>")
    html.append("    </div>")
    html.append("  </div>")

html.append("</body>")
html.append("</html>")

output.write_text("\n".join(html), encoding='utf-8')
print('Generated:', output)
