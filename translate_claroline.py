#!/usr/bin/env python3
"""
Claroline 翻译脚本：法文 JSON → DeepSeek 中文
用法: python3 translate_claroline.py
"""
import json
import os
import sys
import time
import urllib.request
import urllib.error

DEEPSEEK_KEY_FILE = os.path.expanduser("~/.hermes/deepseek_key")
CLAROLINE_SRC = "/home/lcq25/dev/Claroline/src"
API_URL = "https://api.deepseek.com/chat/completions"

SYSTEM_PROMPT = """You are a professional translator specializing in educational platform (LMS) localization.
Translate French UI strings to Simplified Chinese (zh-CN).

RULES:
1. Output ONLY valid JSON, no markdown, no explanation
2. Preserve ALL keys exactly as-is
3. Preserve ALL placeholders: %variable%, {{variable}}, {count}, {0,1}, [2,Inf[
4. Preserve ALL HTML tags and entities: <br/>, <strong>, &amp;, etc.
5. Preserve ICU message format: {0,1} text | [2,Inf[ text
6. Keep technical terms in English: API, URL, HTML, JSON, ID, CSV, PDF, ICS, MIME, IP, SSH
7. Use Chinese for UI labels, but keep proper names (Claroline, Symfony, Font Awesome)
8. For country names, use standard Chinese translations
9. Do NOT translate code identifiers, file extensions, or email addresses
10. Keep the exact same JSON structure (arrays, nested objects)"""

def load_key():
    with open(DEEPSEEK_KEY_FILE) as f:
        return f.read().strip()

def call_deepseek(payload, api_key, max_retries=3):
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(API_URL, data=data, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("Authorization", f"Bearer {api_key}")
    
    for attempt in range(max_retries):
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                result = json.loads(resp.read().decode("utf-8"))
                content = result["choices"][0]["message"]["content"]
                # Strip markdown code fences if present
                content = content.strip()
                if content.startswith("```json"):
                    content = content[7:]
                if content.startswith("```"):
                    content = content[3:]
                if content.endswith("```"):
                    content = content[:-3]
                return content.strip()
        except urllib.error.HTTPError as e:
            body = e.read().decode()[:500]
            if e.code == 429:
                wait = 5 * (attempt + 1)
                print(f"  Rate limited, waiting {wait}s...")
                time.sleep(wait)
            else:
                print(f"  HTTP {e.code}: {body}")
                if attempt == max_retries - 1:
                    return None
                time.sleep(2)
        except Exception as e:
            print(f"  Error: {e}")
            if attempt == max_retries - 1:
                return None
            time.sleep(2)
    return None

def translate_file(fr_path, api_key):
    """Translate a single .fr.json file to Chinese."""
    zh_path = fr_path.replace(".fr.json", ".zh.json")
    
    # Skip if already translated
    if os.path.exists(zh_path):
        print(f"  SKIP (exists): {zh_path}")
        return True
    
    with open(fr_path, encoding="utf-8") as f:
        fr_data = json.load(f)
    
    if not fr_data:
        print(f"  SKIP (empty): {fr_path}")
        return True
    
    fr_json_str = json.dumps(fr_data, ensure_ascii=False, indent=2)
    
    # If file is too large, split into chunks
    if len(fr_json_str) > 8000:
        return translate_large_file(fr_path, zh_path, fr_data, api_key)
    
    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Translate this French JSON to Chinese:\n\n{fr_json_str}"}
        ],
        "temperature": 0.1,
        "max_tokens": 4096,
    }
    
    result = call_deepseek(payload, api_key)
    if result is None:
        return False
    
    try:
        zh_data = json.loads(result)
        # Verify all keys present
        if set(zh_data.keys()) != set(fr_data.keys()):
            missing = set(fr_data.keys()) - set(zh_data.keys())
            extra = set(zh_data.keys()) - set(fr_data.keys())
            print(f"  WARNING: Key mismatch! Missing: {missing}, Extra: {extra}")
            # Still save, but warn
        
        with open(zh_path, "w", encoding="utf-8") as f:
            json.dump(zh_data, f, ensure_ascii=False, indent=2)
        print(f"  OK: {zh_path} ({len(zh_data)} keys)")
        return True
    except json.JSONDecodeError as e:
        print(f"  FAIL: Invalid JSON response: {e}")
        print(f"  Response preview: {result[:200]}")
        return False

def translate_large_file(fr_path, zh_path, fr_data, api_key):
    """Translate large files by splitting into chunks."""
    items = list(fr_data.items())
    chunk_size = 40
    zh_data = {}
    
    for i in range(0, len(items), chunk_size):
        chunk = dict(items[i:i+chunk_size])
        chunk_json = json.dumps(chunk, ensure_ascii=False, indent=2)
        
        payload = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Translate this French JSON to Chinese:\n\n{chunk_json}"}
            ],
            "temperature": 0.1,
            "max_tokens": 4096,
        }
        
        result = call_deepseek(payload, api_key)
        if result is None:
            print(f"  FAIL at chunk {i//chunk_size + 1}")
            return False
        
        try:
            chunk_result = json.loads(result)
            zh_data.update(chunk_result)
            print(f"  Chunk {i//chunk_size + 1}/{(len(items)-1)//chunk_size + 1} done ({len(chunk_result)} keys)")
        except json.JSONDecodeError as e:
            print(f"  FAIL at chunk {i//chunk_size + 1}: {e}")
            return False
        
        time.sleep(0.5)  # Rate limiting
    
    with open(zh_path, "w", encoding="utf-8") as f:
        json.dump(zh_data, f, ensure_ascii=False, indent=2)
    print(f"  OK (large): {zh_path} ({len(zh_data)} keys)")
    return True

def main():
    api_key = load_key()
    
    # Find all French translation files
    fr_files = []
    for root, dirs, files in os.walk(CLAROLINE_SRC):
        if "translations" in root:
            for f in files:
                if f.endswith(".fr.json"):
                    fr_files.append(os.path.join(root, f))
    
    fr_files.sort()
    total = len(fr_files)
    success = 0
    fail = 0
    skip = 0
    
    print(f"Found {total} French translation files")
    print(f"API: {API_URL}")
    print()
    
    for idx, fr_path in enumerate(fr_files):
        rel = os.path.relpath(fr_path, CLAROLINE_SRC)
        print(f"[{idx+1}/{total}] {rel}")
        
        if translate_file(fr_path, api_key):
            success += 1
        else:
            fail += 1
        
        # Rate limit
        time.sleep(0.3)
    
    print()
    print(f"Done: {success} success, {fail} failed, {skip} skipped")

if __name__ == "__main__":
    main()
