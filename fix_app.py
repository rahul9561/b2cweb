import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Find the Footer line to inspect it
for i, line in enumerate(content.split('\n'), 1):
    if 'employee-group-health-insurance/plans' in line:
        print(f"Line {i}: {repr(line)}")

# Replace the startsWith condition for the Footer
old = "location.pathname.startsWith('/employee-group-health-insurance/plans') && <Footer"
new = "location.pathname.match(/^\\/employee-group-health-insurance\\/(plans|thanks)/) && <Footer"

if old in content:
    content = content.replace(old, new, 1)
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("FIX: Replacement successful")
else:
    print("FIX: Search string not found, trying alternative")
    # Try to find with regex
    pattern = r"startsWith\('/employee-group-health-insurance/plans'\) && <Footer"
    replacement = r"match(/^\\/employee-group-health-insurance\\/(plans\|thanks)/) && <Footer"
    new_content = re.sub(pattern, replacement, content, count=1)
    if new_content != content:
        with open('src/App.tsx', 'w') as f:
            f.write(new_content)
        print("FIX: Regex replacement successful")
    else:
        print("FIX: Could not find the pattern")
