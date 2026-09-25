import json, re

seed_path = r'c:\Users\krish\OneDrive\Desktop\Dentkart\backend\src\utils\seedData.ts'

with open(seed_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Mapping from slug to image list
mapping = {
    'true-endo-cordless-endomotor-led': ['/images/products/true-endo-endomotor-led.jpg', '/images/products/true-endo-endomotor-p2-card.jpg'],
    'prime-luting-tempute-temporary-cement': ['/images/products/prime-tempute-cement.jpg', '/images/products/prime-tempute-cement-p4-card.jpg'],
    'topical-fluoride-thixotropic-gel-strawberry': ['/images/products/topical-fluoride-gel.jpg'],
    'blue-shade-lute-glass-ionomer-cement': ['/images/products/blue-shade-lute-gic.jpg'],
    'true-endo-disposable-suction-tips-100': ['/images/products/true-endo-suction-tips.jpg', '/images/products/true-endo-suction-tips-card.jpg'],
    'ultrasonic-scaler-tips-universal': ['/images/products/scaler-tips-universal.jpg', '/images/products/scaler-tips-universal-card.jpg'],
    'true-endo-stone-trimming-bur': ['/images/products/true-endo-stone-bur.jpg', '/images/products/true-endo-stone-bur-card.jpg'],
    'true-endo-metal-trimming-bur': ['/images/products/true-endo-stone-bur.jpg', '/images/products/true-endo-stone-bur-card.jpg'],
    'true-endo-niti-rotary-files-pack': ['/images/products/true-endo-niti-files.jpg', '/images/products/true-endo-niti-files-card.jpg'],
    'high-speed-standard-push-button-handpiece': ['/images/products/high-speed-airotor-handpiece.jpg', '/images/products/high-speed-airotor-handpiece-card.jpg'],
    'true-endo-e-generator-led-handpiece': ['/images/products/true-endo-led-handpiece.jpg', '/images/products/true-endo-led-handpiece-card.jpg'],
    'true-endo-edta-17-canal-gel': ['/images/products/true-endo-edta-gel.jpg', '/images/products/true-endo-edta-gel-card.jpg'],
    'true-endo-flow-composite-syringe': ['/images/products/true-endo-flow-composite.jpg', '/images/products/true-endo-flow-composite-card.jpg'],
    'true-endo-cem-lc-gi-cement': ['/images/products/true-endo-cem-lc-gic.jpg', '/images/products/true-endo-cem-lc-gic-card.jpg'],
    'true-endo-aura-spray-lubricant-500ml': ['/images/products/true-endo-aura-spray.jpg', '/images/products/true-endo-aura-spray-card.jpg'],
    'true-endo-dental-mixing-pad-50': ['/images/products/true-endo-mixing-pad.jpg', '/images/products/true-endo-mixing-pad-card.jpg'],
    'true-endo-temp-fill-material-30g': ['/images/products/true-endo-temp-fill.jpg', '/images/products/true-endo-temp-fill-card.jpg'],
    'true-endo-universal-composite-4g': ['/images/products/true-endo-composite-p2.jpg', '/images/products/true-endo-composite-p2-card.jpg'],
    'true-endo-micro-applicator-tips-100': ['/images/products/true-endo-applicator-tips.jpg', '/images/products/true-endo-applicator-tips-card.jpg'],
    'true-endo-metal-impression-trays-set': ['/images/products/true-endo-metal-trays.jpg', '/images/products/true-endo-metal-trays-card.jpg'],
    'medsilk-black-braided-silk-suture': ['/images/products/medsilk-suture.jpg', '/images/products/medsilk-suture-card.jpg'],
    'medcryl-polyglactin-absorbable-suture': ['/images/products/medcryl-suture-1100.jpg', '/images/products/medcryl-suture-1100-card.jpg'],
    'medcryl-monofilament-rapid-suture': ['/images/products/medcryl-suture-1200.jpg', '/images/products/medcryl-suture-1200-card.jpg'],
    'healix-in-office-bleaching-kit': ['/images/products/healix-bleaching-kit.jpg', '/images/products/healix-bleaching-kit-card.jpg'],
    'healix-37-phosphoric-acid-etchant-gel': ['/images/products/healix-etchant-gel.jpg', '/images/products/healix-etchant-gel-card.jpg'],
    'aero-blast-prophy-powder-300g': ['/images/products/aero-blast-powder.jpg', '/images/products/aero-blast-powder-card.jpg'],
    'aero-blast-glycine-powder-1kg': ['/images/products/aero-blast-powder.jpg', '/images/products/aero-blast-powder-card.jpg'],
    'healix-x3-cordless-led-light-cure': ['/images/products/healix-x3-light-cure.jpg', '/images/products/healix-x3-light-cure-card.jpg'],
    'smart-saddle-matrices-kit': ['/images/products/smart-saddle-matrices-kit.jpg', '/images/products/smart-saddle-matrices-kit-card.jpg'],
    'dual-side-vented-irrigation-needles-30g': ['/images/products/dual-sidevent-needles.jpg', '/images/products/dual-sidevent-needles-card.jpg'],
    'smart-nanofill-hybrid-composite-kit': ['/images/products/smart-nanofill-composite-kit.jpg', '/images/products/smart-nanofill-composite-kit-card.jpg'],
    'true-endo-cem-resin-reinforced-luting-kit': ['/images/products/true-endo-cem-resin-kit.jpg', '/images/products/true-endo-cem-resin-kit-card.jpg'],
    'sectional-contoured-matrix-system-kit': ['/images/products/sectional-matrix-kit.jpg', '/images/products/sectional-matrix-kit-card.jpg'],
    'smart-temp-cavity-temporary-filling-30g': ['/images/products/smart-temp-filling.jpg', '/images/products/smart-temp-filling-card.jpg'],
    'standardized-gutta-percha-paper-points-combo': ['/images/products/gp-paper-points-combo.jpg', '/images/products/gp-paper-points-combo-card.jpg'],
    'fender-wedges-interproximal-shield-box': ['/images/products/fender-wedges.jpg', '/images/products/fender-wedges-card.jpg'],
    'endo-plug-niti-hand-condenser-pluggers': ['/images/products/endo-plug-niti.jpg', '/images/products/endo-plug-niti-card.jpg'],
    'endo-plug-niti-thermal-obturation-pluggers': ['/images/products/endo-plug-niti.jpg', '/images/products/endo-plug-niti-card.jpg'],
    'true-endo-diamond-polishing-paste-50g': ['/images/products/true-endo-polishing-paste.jpg', '/images/products/true-endo-polishing-paste-card.jpg'],
    'true-endo-h-bond-7-self-etch-adhesive': ['/images/products/true-endo-h-bond-7.jpg', '/images/products/true-endo-h-bond-7-card.jpg'],
    'true-endo-autoclavable-plastic-impression-trays': ['/images/products/true-endo-plastic-trays.jpg', '/images/products/true-endo-plastic-trays-card.jpg'],
    'true-endo-rvg-sensor-protective-sleeves-500': ['/images/products/true-endo-rvg-sleeves.jpg', '/images/products/true-endo-rvg-sleeves-card.jpg'],
    'true-endo-absorbent-cotton-rolls-1000': ['/images/products/true-endo-cotton-rolls.jpg', '/images/products/true-endo-cotton-rolls-card.jpg'],
    'true-endo-nitrile-examination-gloves-100': ['/images/products/true-endo-nitrile-gloves.jpg', '/images/products/true-endo-nitrile-gloves-card.jpg'],
    'true-endo-latex-examination-gloves-100': ['/images/products/true-endo-latex-gloves.jpg', '/images/products/true-endo-latex-gloves-card.jpg'],
    'true-endo-cal-calcium-hydroxide-paste': ['/images/products/true-endo-cal-paste.jpg', '/images/products/true-endo-cal-paste-card.jpg'],
    'true-endo-cem-automix-resin-cement-8g': ['/images/products/true-endo-cem-automix.jpg', '/images/products/true-endo-cem-automix-card.jpg'],
    'true-endo-cal-plus-iodoform-paste': ['/images/products/true-endo-cal-plus.jpg', '/images/products/true-endo-cal-plus-card.jpg'],
    'lignospan-local-anaesthetic-30ml-vial': ['/images/products/la-lignocaine-vials.jpg', '/images/products/la-lignocaine-vials-card.jpg'],
    'unolok-disposable-luer-lock-syringes-2-5ml': ['/images/products/unolok-syringes-25ml.jpg', '/images/products/unolok-syringes-25ml-card.jpg'],
    'drikam-neoalgin-chromatic-alginate-450g': ['/images/products/drikam-neoalgin-alginate.jpg', '/images/products/drikam-neoalgin-alginate-card.jpg'],
    'true-endo-universal-scaler-tips-pack-5': ['/images/products/true-endo-scaler-tips-pack5.jpg', '/images/products/true-endo-scaler-tips-pack5-card.jpg']
}

updated_count = 0
for slug, imgs in mapping.items():
    pattern = r"(slug:\s*'" + re.escape(slug) + r"'[\s\S]*?images:\s*\[)[^\]]*?(\])"
    img_json = ',\n      '.join(f"'{i}'" for i in imgs)
    if re.search(pattern, content):
        content = re.sub(pattern, r"\1\n      " + img_json + r"\n    \2", content, count=1)
        updated_count += 1
    else:
        print(f"Warning: pattern not matched for slug: {slug}")

with open(seed_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f'Successfully updated {updated_count} products with authentic brochure product images!')
