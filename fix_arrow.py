# Fix script: replace "Know More >" with "Know More {'>'}" in TaxPart2Sections.tsx
with open('src/components/tax/TaxPart2Sections.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old = 'Know More >'
new = "Know More {' >'}"

content = content.replace(old, new)

with open('src/components/tax/TaxPart2Sections.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed: replaced "Know More >" with JSX expression form')
