import zipfile, os, subprocess, shutil

base_dir = r'c:\Users\krish\OneDrive\Desktop\Dentkart'
src_apk = os.path.join(base_dir, r'RELEASE_BUILDS\DentaKart-Installable.apk')
backup_apk = os.path.join(base_dir, r'RELEASE_BUILDS\DentaKart-Installable.apk.bak')
staging_apk = os.path.join(base_dir, r'RELEASE_BUILDS\temp_unsigned.apk')
aligned_apk = os.path.join(base_dir, r'RELEASE_BUILDS\temp_aligned.apk')
final_apk = os.path.join(base_dir, r'RELEASE_BUILDS\DentaKart-Installable.apk')

dist_dir = os.path.join(base_dir, r'frontend\dist')
keystore_path = os.path.join(base_dir, r'frontend\android\app\dentkart-release.keystore')
build_tools_dir = r'C:\Users\krish\AppData\Local\Android\Sdk\build-tools\35.0.0'
zipalign_bin = os.path.join(build_tools_dir, 'zipalign.exe')
apksigner_bin = os.path.join(build_tools_dir, 'apksigner.bat')
java_home = r'C:\Program Files\Android\Android Studio\jbr'

if not os.path.exists(backup_apk):
    shutil.copy2(src_apk, backup_apk)

env = os.environ.copy()
env['JAVA_HOME'] = java_home
env['PATH'] = os.path.join(java_home, 'bin') + ';' + env.get('PATH', '')

print("1. Creating unsigned staging APK with updated web assets...")
with zipfile.ZipFile(backup_apk, 'r') as zin:
    with zipfile.ZipFile(staging_apk, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            # Skip old signature files and old web public assets
            if item.filename.startswith('META-INF/') or item.filename.startswith('assets/public/'):
                continue
            data = zin.read(item.filename)
            zout.writestr(item, data)

        # Inject fresh web assets from frontend/dist
        for root, dirs, files in os.walk(dist_dir):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, dist_dir).replace('\\', '/')
                # Don't embed the APK inside the APK itself
                if rel_path.endswith('.apk'):
                    continue
                archive_name = 'assets/public/' + rel_path
                zout.write(full_path, archive_name)

print("2. Running zipalign...")
if os.path.exists(aligned_apk):
    os.remove(aligned_apk)
res_align = subprocess.run([zipalign_bin, '-p', '-f', '4', staging_apk, aligned_apk], capture_output=True, text=True)
if res_align.returncode != 0:
    print("Zipalign error:", res_align.stderr)
    exit(1)
print("Zipalign succeeded.")

print("3. Running apksigner with dentkart-release.keystore...")
res_sign = subprocess.run([
    apksigner_bin, 'sign',
    '--ks', keystore_path,
    '--ks-pass', 'pass:dentkart2026',
    '--ks-key-alias', 'dentkart',
    '--key-pass', 'pass:dentkart2026',
    '--v1-signing-enabled', 'true',
    '--v2-signing-enabled', 'true',
    '--out', final_apk,
    aligned_apk
], env=env, capture_output=True, text=True)

if res_sign.returncode != 0:
    print("Apksigner error:", res_sign.stderr or res_sign.stdout)
    exit(1)
print("Signing succeeded!")

print("4. Verifying signed APK...")
res_verify = subprocess.run([apksigner_bin, 'verify', '--verbose', final_apk], env=env, capture_output=True, text=True)
print(res_verify.stdout)

# Clean up temp files
if os.path.exists(staging_apk): os.remove(staging_apk)
if os.path.exists(aligned_apk): os.remove(aligned_apk)

# Distribute updated APK to download locations
download_destinations = [
    os.path.join(base_dir, r'backend\client_dist\download\DentaKart.apk'),
    os.path.join(base_dir, r'frontend\public\download\DentaKart.apk'),
    os.path.join(base_dir, r'frontend\dist\download\DentaKart.apk')
]

for d in download_destinations:
    os.makedirs(os.path.dirname(d), exist_ok=True)
    shutil.copy2(final_apk, d)
    print(f"Copied to: {d} ({os.path.getsize(d):,} bytes)")

print("\nFresh APK successfully packaged, aligned, signed, and ready for install!")
