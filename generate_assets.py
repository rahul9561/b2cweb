import os, io, zipfile

os.makedirs('public/documents', exist_ok=True)

# Create minimal valid PDF
def create_minimal_pdf(filepath, title_text):
    objects = []
    objects.append(b'1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj\n')
    objects.append(b'2 0 obj\n<</Type/Pages/Count 1/Kids[3 0 R]>>\nendobj\n')
    objects.append(b'3 0 obj\n<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<</Font<</F1 4 0 R>>>>/Contents 6 0 R>>\nendobj\n')
    objects.append(b'4 0 obj\n<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>\nendobj\n')

    stream_content = (
        'BT /F1 24 Tf 72 600 Td (' + title_text + ') Tj ET\n'
        'BT /F1 12 Tf 72 560 Td (This is a placeholder document for AV Management Group Health Insurance.) Tj ET\n'
        'BT /F1 12 Tf 72 530 Td (It demonstrates the download functionality from the confirmation page.) Tj ET'
    )
    stream_bytes = stream_content.encode('latin-1')
    objects.append(f'6 0 obj\n<< /Length {len(stream_bytes)} >>\nstream\n'.encode('latin-1') + stream_bytes + b'\nendstream\nendobj\n')

    pdf = b'%PDF-1.4\n'
    offsets = [0]
    for obj in objects:
        offsets.append(len(pdf))
        pdf += obj

    num_objects = len(objects) + 1
    xref_pos = len(pdf)
    pdf += f'xref\n0 {num_objects}\n'.encode()
    pdf += b'0000000000 65535 f \r\n'
    for i in range(1, num_objects):
        pdf += f'{offsets[i]:010d} 00000 n \r\n'.encode()

    pdf += f'trailer\n<</Size {num_objects}/Root 1 0 R>>\n'.encode()
    pdf += b'startxref\n'
    pdf += f'{xref_pos}\n'.encode()
    pdf += b'%%EOF'

    with open(filepath, 'wb') as f:
        f.write(pdf)
    print(f'Created PDF: {filepath} ({len(pdf)} bytes)')

create_minimal_pdf('public/documents/av-management-group-health-insurance-introduction.pdf', 'AV Management Group Health Insurance Introduction')

# Create minimal valid XLSX
def create_minimal_xlsx(filepath):
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.writestr('[Content_Types].xml',
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
            '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
            '<Default Extension="xml" ContentType="application/xml"/>'
            '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
            '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
            '</Types>')
        zf.writestr('_rels/.rels',
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
            '</Relationships>')
        zf.writestr('xl/workbook.xml',
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
            '<sheets><sheet name="Member Data" sheetId="1" r:id="rId1"/></sheets>'
            '</workbook>')
        zf.writestr('xl/_rels/workbook.xml.rels',
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'
            '</Relationships>')
        zf.writestr('xl/worksheets/sheet1.xml',
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
            '<sheetData>'
            '<row r="1"><c r="A1" t="inlineStr"><is><t>Employee Name</t></is></c><c r="B1" t="inlineStr"><is><t>Age</t></is></c><c r="C1" t="inlineStr"><is><t>Gender</t></is></c><c r="D1" t="inlineStr"><is><t>City</t></is></c></row>'
            '</sheetData>'
            '</worksheet>')
    xlsx_bytes = buf.getvalue()
    with open(filepath, 'wb') as f:
        f.write(xlsx_bytes)
    print(f'Created XLSX: {filepath} ({len(xlsx_bytes)} bytes)')

create_minimal_xlsx('public/documents/member-data-format.xlsx')
print('All files created successfully!')
