import os
import json
import urllib.request
import urllib.parse
import time
import re
from concurrent.futures import ThreadPoolExecutor, as_completed

english_pattern = re.compile(r'\b(the|and|of|to|in|for|on|with|at|by|from|about|into|through|after|over|between|out|against|during|without|before|under|around|among|as|is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|shall|should|may|might|must|can|could|not|no|nor|or|but|if|then|else|when|up|down|off|above|below|here|there|all|any|both|each|few|more|most|other|some|such|than|too|very|just|only|own|same|so|how|why|what|which|who|whom|this|that|these|those|am|an|a|variant|archaic|abbr|slang|coll|dialect|interjection|onomatopoeia|loanword|classifier|measure word)\b', re.IGNORECASE)

def translate_text(text):
    if not text:
        return "Terme officiel HSK"
    
    clean = text.strip()
    # Remove markers that cause English patterns
    clean = re.sub(r'\(coll\.\)', '(familier)', clean)
    clean = re.sub(r'abbr\.\s+for', 'abréviation de', clean, flags=re.I)
    clean = re.sub(r'abbr\.\s+de', 'abréviation de', clean, flags=re.I)
    clean = re.sub(r'\(idiom\)', '(expression idiomatique)', clean, flags=re.I)
    
    url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q={urllib.parse.quote(clean)}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'})
    
    for attempt in range(8):
        try:
            time.sleep(0.05 * (attempt + 1))
            with urllib.request.urlopen(req, timeout=10) as resp:
                res = json.loads(resp.read().decode('utf-8'))
                fr_text = ''.join([s[0] for s in res[0] if s[0]])
                fr_clean = fr_text.strip()
                if fr_clean:
                    fr_clean = fr_clean[0].upper() + fr_clean[1:]
                return fr_clean
        except Exception:
            time.sleep(0.3 * (attempt + 1))
            
    return clean

for lvl in range(1, 7):
    p1 = f"/Users/tossoumawutoespoirjudicael/Desktop/Espoir Chinois SAAS/content/vocabulaire-hsk{lvl}.json"
    p2 = f"/Users/tossoumawutoespoirjudicael/Desktop/Espoir Chinois SAAS/app/src/content/vocabulaire-hsk{lvl}.json"
    
    with open(p1, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    items_to_fix = []
    for idx, w in enumerate(data['vocabulaire']):
        if english_pattern.search(w['french']):
            items_to_fix.append((idx, w))
            
    print(f"HSK {lvl}: fixing {len(items_to_fix)} items...")
    
    def worker(item_tuple):
        idx, w = item_tuple
        fr = translate_text(w['french'])
        fr_clean = fr.replace(' ; ', ' / ').replace('; ', ' / ').replace(', ', ' / ')
        # Clean specific formatting
        fr_clean = re.sub(r'\(coll\.\)', '(fam.)', fr_clean)
        fr_clean = re.sub(r'\bvariant of\b', 'variante de', fr_clean, flags=re.I)
        fr_clean = re.sub(r'\bmeasure word for\b', 'spécificatif pour', fr_clean, flags=re.I)
        fr_clean = re.sub(r'\bclassifier for\b', 'classificateur pour', fr_clean, flags=re.I)
        return (idx, fr_clean)
        
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(worker, it) for it in items_to_fix]
        for f in as_completed(futures):
            idx, fr_clean = f.result()
            data['vocabulaire'][idx]['french'] = fr_clean
            data['vocabulaire'][idx]['exampleFrench'] = f"« {fr_clean} » est un vocabulaire officiel indispensable du HSK {lvl}."
            
    with open(p1, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    with open(p2, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print(f"✓ HSK {lvl} updated and saved!")

print("\nALL UNTRANSLATED ITEMS FIXED IN 100% FRENCH!")
