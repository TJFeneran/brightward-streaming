"""Build synchronized narration, optionally retaining the existing four-slide PDF."""
import argparse
from pathlib import Path
import json
import re

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--narration-only', action='store_true',
                    help='Update narration without exporting or replacing the PDF.')
ARGS = parser.parse_args()

if not ARGS.narration_only:
    from reportlab.pdfgen import canvas
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.lib.colors import HexColor

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'presentation/content.json').read_text())
SLIDES = DATA['slides']
DEMO = DATA['demo']
SEQUENCE = []
for slide in SLIDES:
    SEQUENCE.append(slide)
    if slide['number'] == DEMO['after_slide']:
        SEQUENCE.append(DEMO)


def window_seconds(window):
    return tuple(int(m) * 60 + int(s) for m, s in
                 (part.split(':') for part in window.split('-')))


def validate_flow():
    assert [s['number'] for s in SLIDES] == [1, 2, 3, 4]
    assert DEMO['after_slide'] == 2
    cursor = 0
    for segment in SEQUENCE:
        start, end = window_seconds(segment['window'])
        assert start == cursor and end - start == segment['seconds']
        beat_cursor = start
        for beat in segment['rehearsal']:
            beat_start, beat_end = window_seconds(beat['window'])
            assert beat_start == beat_cursor and beat_end > beat_start
            beat_cursor = beat_end
        assert beat_cursor == end
        cursor = end
    assert cursor == DATA.get('duration_seconds', 300)
    assert cursor <= DATA.get('recording_target_seconds', 300)


validate_flow()
for alias, filename in ([] if ARGS.narration_only else [
    ('heading', 'Sora-500'), ('body', 'Inter-400'),
    ('medium', 'Inter-500'), ('bold', 'Inter-600'),
    ('mono', 'IBM-Plex-Mono-400'),
]):
    pdfmetrics.registerFont(TTFont(alias, str(ROOT / 'presentation/fonts' / f'{filename}.ttf')))

W, H = 1200, 675
C = {} if ARGS.narration_only else {key: HexColor(value) for key, value in dict(
    bg='#0B1220', surface='#162235', text='#EEF4FA', accent='#5EEAD4',
    muted='#A9B9CF', divider='#314158', warning='#FBBF24',
).items()}
c = None
if not ARGS.narration_only:
    c = canvas.Canvas(str(ROOT / 'Brightward-Slides.pdf'), pagesize=(W, H), pageCompression=1)
    c.setTitle('Brightward | OpenAI Platform & API for incident investigation')
    c.setAuthor('Brightward demo project')


def text(value, x, y, size=22, font='body', color='text', max_width=None):
    available = W - x - 60 if max_width is None else max_width
    if pdfmetrics.stringWidth(value, font, size) > available:
        raise ValueError(f'Text exceeds its layout width ({available}): {value}')
    if y < 0 or y + size > H:
        raise ValueError(f'Text exceeds page height: {value}')
    c.setFillColor(C[color])
    c.setFont(font, size)
    c.drawString(x, H - y - size * .80, value)


def line(x1, y1, x2, y2, color='divider', width=1):
    c.setStrokeColor(C[color])
    c.setLineWidth(width)
    c.line(x1, H - y1, x2, H - y2)


def box(x, y, w, h, accent=False):
    c.setFillColor(C['surface'])
    c.setStrokeColor(C['accent' if accent else 'divider'])
    c.setLineWidth(1)
    c.roundRect(x, H - y - h, w, h, 14, fill=1, stroke=1)


def base(slide):
    c.setFillColor(C['bg'])
    c.rect(0, 0, W, H, fill=1, stroke=0)
    text(slide['kicker'], 60, 44, 14, 'mono', 'accent')
    text(slide['title'], 60, 94, 44, 'heading')
    if slide['subtitle']:
        text(slide['subtitle'], 60, 157, 23, 'body', 'muted')
    line(60, 617, 1140, 617)
    text('BRIGHTWARD / FICTIONAL CUSTOMER + SYNTHETIC INCIDENTS', 60, 638, 11, 'mono', 'muted')
    text(f"{slide['number']:02d} / {len(SLIDES):02d}", 1070, 638, 12, 'mono', 'muted')


for slide in ([] if ARGS.narration_only else SLIDES):
    base(slide)
    a = slide['lines']
    n = slide['number']
    if n == 1:
        text(a[0], 60, 219, 24)
        for i, x in enumerate([60, 428, 796]):
            offset = 1 + i * 3
            box(x, 274, 344, 228)
            text(f'{i + 1:02d}', x + 26, 302, 18, 'mono', 'accent')
            text(a[offset], x + 26, 348, 23, 'medium', max_width=292)
            text(a[offset + 1], x + 26, 402, 21, color='muted', max_width=292)
            text(a[offset + 2], x + 26, 433, 21, color='muted', max_width=292)
        text(a[10], 60, 552, 23, 'medium', 'accent')
    elif n == 2:
        for x, offset in [(60, 0), (615, 3)]:
            box(x, 219, 525, 212, accent=(offset == 0))
            text(a[offset], x + 26, 250, 31, 'heading', 'accent', max_width=473)
            text(a[offset + 1], x + 26, 316, 22, max_width=473)
            text(a[offset + 2], x + 26, 359, 22, color='muted', max_width=473)
        text(a[6], 60, 467, 14, 'mono', 'accent')
        text(a[7], 60, 494, 28, 'medium')
        text(a[8], 60, 553, 22, color='muted')
        source_x = 60
        text('Sources:', source_x, 590, 11, color='muted')
        source_x += 51
        for ref in DATA['product_references'][:2]:
            label = ref['title']
            width = pdfmetrics.stringWidth(label, 'body', 11)
            text(label, source_x, 590, 11, color='muted')
            c.linkURL(ref['url'], (source_x, H - 602, source_x + width, H - 588), relative=0)
            source_x += width + 23
    elif n == 3:
        box(60, 216, 400, 344, True)
        text(a[0], 86, 246, 40, 'heading', 'accent', max_width=348)
        text(a[1], 86, 307, 23, 'medium', max_width=348)
        text(a[2], 86, 355, 20, color='warning', max_width=348)
        text(a[3], 86, 410, 19, color='muted', max_width=348)
        line(86, 449, 434, 449)
        text(a[4], 86, 477, 19, max_width=348)
        text(a[5], 86, 505, 19, max_width=348)
        text(a[6], 505, 228, 15, 'mono', 'accent')
        text(a[7], 505, 260, 23)
        text(a[8], 505, 295, 21, color='muted')
        line(505, 336, 1140, 336)
        text(a[9], 505, 361, 15, 'mono', 'accent')
        text(a[10], 505, 393, 23)
        text(a[11], 505, 428, 21, color='muted')
        text(a[12], 505, 491, 15, 'mono', 'accent')
        text(a[13], 505, 523, 21)
    elif n == 4:
        for i, y in enumerate([218, 328, 438]):
            box(60, y, 1080, 88)
            text(f'{i + 1:02d}', 86, y + 31, 19, 'mono', 'accent')
            text(a[i * 2], 144, y + 28, 26, 'medium', max_width=180)
            text(a[i * 2 + 1], 346, y + 33, 21, max_width=766)
        text(a[6], 60, 560, 26, 'medium', 'accent')
    c.showPage()
if c is not None:
    c.save()


def spoken_words(segment):
    return sum(len(re.findall(r"\b[\w'-]+\b", beat['spoken'])) for beat in segment['rehearsal'])


words = sum(spoken_words(segment) for segment in SEQUENCE)
duration = DATA.get('duration_seconds', 300)
target = DATA.get('recording_target_seconds', 300)
pdf_status = ('The original four-page PDF is retained from draft 7; no PDF export was made.'
              if ARGS.narration_only else 'The four-page PDF was regenerated from the current source.')
md = f'''# Brightward: OpenAI Platform & API - slide copy and narration

Revision {DATA['script_revision']}, {DATA['date']}. Generated by `tools/build-slides-pdf.py` from `presentation/content.json`. Four slides and a demo between slides 2 and 3. {DATA['script_status']}

{pdf_status} The current animated presentation lives in `fslides/decks/brightward/`.

{DATA['overview']}

## Timing

| Segment | Window | Seconds | Spoken words |
| --- | --- | --- | --- |
'''
for segment in SEQUENCE:
    label = f"Slide {segment['number']}: {segment['title']}" if 'number' in segment else 'Demo between slides 2 and 3'
    md += f"| {label} | {segment['window']} | {segment['seconds']} | {spoken_words(segment)} |\n"
md += f'\nNarration: {words} words. TJ reported a stopwatch rehearsal just under five minutes. The supplied segment labels total {duration} seconds ({duration // 60}:{duration % 60:02d}), leaving {target - duration} seconds against the five-minute limit. The cumulative windows derive from those labels. Live generation waits and navigation still need to fit the recorded take. Demo budget: {DEMO["seconds"]} seconds; {DEMO["budget"]}\n'
md += '\n## Before the take (not spoken)\n\n'
md += '\n\n'.join(f'{i}. {note}' for i, note in enumerate(DATA['rehearsal_setup'], 1)) + '\n'
for segment in SEQUENCE:
    if 'number' in segment:
        md += f"\n## Slide {segment['number']}: {segment['title']}\n\n### On-slide wording\n\n{segment['kicker']}\n\n"
        if segment['subtitle']:
            md += segment['subtitle'] + '\n\n'
        md += '\n'.join('- ' + value for value in segment['lines']) + '\n'
    else:
        md += f"\n## Demo between slides 2 and 3: {segment['title']}\n\nStay in the browser for the complete {segment['window']} segment: app first, Platform second, then return directly to slide 3.\n"
    md += '\n### Timed rehearsal\n'
    for beat in segment['rehearsal']:
        md += f"\n#### {beat['window']}\n\n**Spoken narration**\n\n{beat['spoken']}\n\n**On-screen action / pause - not spoken**\n\n{beat['action']}\n"
md += "\n## Product references\n\nReferences retained from the approved project. Signed-in Platform template names, account access and controls still need preflight before recording.\n\n"
md += '\n\n'.join(f"[{ref['title']}]({ref['url']}): {ref['note']}" for ref in DATA['product_references']) + '\n'
(ROOT / 'Brightward-Slide-Copy-and-Narration.md').write_text('\n'.join(line.rstrip() for line in md.splitlines()) + '\n')
plain = []
for segment in SEQUENCE:
    label = f"Slide {segment['number']} - {segment['title']} ({segment['seconds']}s)" if 'number' in segment else f"Demo between slides 2 and 3 ({segment['seconds']}s)"
    plain.extend([label, '', '\n\n'.join(beat['spoken'] for beat in segment['rehearsal']), ''])
(ROOT / 'Brightward-Speaking-Script.txt').write_text('\n'.join(line.rstrip() for line in '\n'.join(plain).splitlines()).rstrip() + '\n')
notes_path = ROOT / 'fslides/decks/brightward/notes.json'
if notes_path.exists():
    notes = {}
    for slide, filename in zip(SLIDES, ['01-situation.html', '02-platform.html', '03-value.html', '04-next-steps.html']):
        value = f"TJ’s timed script: {slide['window']} ({slide['seconds']} seconds).\n\n"
        value += '\n\n'.join(beat['spoken'] for beat in slide['rehearsal'])
        if slide['number'] == DEMO['after_slide']:
            value += '\n\nDEMO AFTER THIS SLIDE: app first, Platform second; stay in the browser, then return directly to slide 3.\n\n'
            value += '\n\n'.join(f"{beat['window']}\n{beat['spoken']}" for beat in DEMO['rehearsal'])
        notes[filename] = value
    notes_path.write_text(json.dumps(notes, ensure_ascii=False, indent=2) + '\n')
print(f'Built synchronized narration ({words} spoken words, {duration} scheduled seconds). {pdf_status}')
for segment in SEQUENCE:
    print(f"{segment['window']}: {segment['title']} ({spoken_words(segment)} words)")
