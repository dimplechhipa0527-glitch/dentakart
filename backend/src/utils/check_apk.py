import zipfile, os

apk_path = r'c:\Users\krish\OneDrive\Desktop\Dentkart\RELEASE_BUILDS\DentaKart-Installable.apk'

with zipfile.ZipFile(apk_path, 'r') as z:
    names = z.namelist()
    assets = [n for n in names if n.startswith('assets/')]
    print(f"Total entries in APK: {len(names)}, assets: {len(assets)}")
    for a in sorted(assets)[:25]:
        print(" ", a)
