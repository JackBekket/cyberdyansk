#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Генератор content/assets.json из content/cards.json.

Простой скрипт на stdlib (python3, без зависимостей): проходит по всем
колодам (decks[]) и pinnedRow в cards.json, собирает все места, где в UI
нужен арт, и складывает их в единый манифест для генерации через
Stable Diffusion.

Правила извлечения:
  card-art    — у каждой карты; если artDescription нет → status "tbd".
                Карты kind == "deck-banner" дают не card-art, а deck-art
                своей колоды (баннерный тайл = сама колода).
  action-art  — у каждого действия с artDescription.
                * текст начинается с «тот же арт» → shared-ссылка на другое
                  действие той же карты;
                * текст идентичен уже встречавшемуся → shared-ссылка на
                  первый такой ассет (например, иконка «ухо»).
  comic-panel — каждый элемент outcome.comicStripPanels /
                outcomeFail.comicStripPanels (пустые списки пропускаются);
                идентичные описания панелей в разных стрипах → shared.
  window-art  — поле windowArtDescription у карты.
  deck-art    — баннер колоды + рубашка карты (царапанный паттерн, см.
                meta.mechanics.handRefresh).

Промпт при генерации = styleBlock.positive + ", " + subjectEn.
subjectEn пока null — заполняется вручную по descriptionRu перед генерацией.
"""

import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CARDS_PATH = ROOT / "content" / "cards.json"
ASSETS_PATH = ROOT / "content" / "assets.json"

STYLE_BLOCK = {
    "positive": (
        "cyberpunk noir inked illustration, muted desaturated palette, "
        "gritty urban decay, painterly comic art direction"
    ),
    "negative": "photorealistic, 3d render, bright neon oversaturation, text, watermark",
}

ASPECTS = {
    "card-art": "3:4",      # карты в руке — портрет (ориентировочно по скриншотам)
    "action-art": "1:1",    # иконки/мини-арты действий
    "comic-panel": "4:5",   # панели стрипа — ближе к квадрату/портрету
    "window-art": "3:2",    # фоновые арты окон сервисных точек
    "deck-art": "3:2",      # баннеры колод
}

META = {
    "source": "content/cards.json",
    "generatedBy": "scripts/generate_assets.py (python3, без зависимостей)",
    "promptFormula": 'styleBlock.positive + ", " + subjectEn; subjectEn заполняется вручную по descriptionRu',
    "statusLegend": {
        "draft": "описание зафиксировано в cards.json — осталось написать subjectEn и сгенерить",
        "tbd": "арт не зафиксирован кадром — описание появится позже",
        "shared": "тот же арт, что у ref — генерируется один раз и переиспользуется",
    },
    "aspectNote": "aspectRatio ориентировочный по скриншотам; сверить с реальным UI перед генерацией",
}


def make_asset(asset_id, type_, source_ref, description_ru, status="draft", ref=None, aspect=None):
    return {
        "id": asset_id,
        "type": type_,
        "sourceRef": source_ref,
        "descriptionRu": description_ru,
        "subjectEn": None,
        "aspectRatio": aspect or ASPECTS[type_],
        "status": status,
        "ref": ref,
        "filePath": None,
    }


def process_card(card, base_ref, deck_id, assets, seen_action_art, seen_panel):
    cid = card["id"]
    kind = card.get("kind")

    # --- арт карты / баннер колоды -------------------------------------
    if kind == "deck-banner" and deck_id:
        desc = (card.get("artDescription") or "").strip() or "арт не зафиксирован кадром"
        assets.append(make_asset(
            f"deck-art:{deck_id}", "deck-art",
            {"deckId": deck_id, "cardId": cid}, desc,
            status="draft" if card.get("artDescription") else "tbd",
        ))
    else:
        ref = dict(base_ref)
        ref["cardId"] = cid
        art_desc = (card.get("artDescription") or "").strip()
        if art_desc:
            assets.append(make_asset(f"card-art:{cid}", "card-art", ref, art_desc))
        else:
            assets.append(make_asset(
                f"card-art:{cid}", "card-art", ref,
                "арт не зафиксирован кадром", status="tbd",
            ))

    # --- фоновый арт окна ----------------------------------------------
    window_art = (card.get("windowArtDescription") or "").strip()
    if window_art:
        ref = dict(base_ref)
        ref["cardId"] = cid
        assets.append(make_asset(f"window-art:{cid}", "window-art", ref, window_art))

    # --- арты действий и панели комиксов ---------------------------------
    actions = card.get("actions") or []
    for i, act in enumerate(actions):
        action_id = act["actionId"]
        desc = (act.get("artDescription") or "").strip()
        if not desc:
            continue

        ref = dict(base_ref)
        ref.update({"cardId": cid, "actionId": action_id})
        aid = f"action-art:{cid}:{action_id}"

        if desc.startswith("тот же арт"):
            # явная ссылка на арт другого действия той же карты
            ref_id = None
            for prev in actions[:i]:
                pdesc = (prev.get("artDescription") or "").strip()
                if pdesc and not pdesc.startswith("тот же арт"):
                    ref_id = f"action-art:{cid}:{prev['actionId']}"
                    break
            assets.append(make_asset(
                aid, "action-art", ref, desc,
                status="shared" if ref_id else "draft", ref=ref_id,
            ))
        else:
            prev_id = seen_action_art.get(desc)
            if prev_id:
                assets.append(make_asset(aid, "action-art", ref, desc, status="shared", ref=prev_id))
            else:
                assets.append(make_asset(aid, "action-art", ref, desc))
                seen_action_art[desc] = aid

        # панели комикс-полос (у outcome и outcomeFail)
        for outcome_key in ("outcome", "outcomeFail"):
            out = act.get(outcome_key) or {}
            panels = out.get("comicStripPanels") or []
            if not panels:
                continue
            fail_suffix = "fail:" if outcome_key == "outcomeFail" else ""
            for n, text in enumerate(panels, 1):
                pid = f"comic-panel:{cid}:{action_id}:{fail_suffix}p{n}"
                prev_pid = seen_panel.get(text)
                if prev_pid:
                    assets.append(make_asset(pid, "comic-panel", ref, text, status="shared", ref=prev_pid))
                else:
                    assets.append(make_asset(pid, "comic-panel", ref, text))
                    seen_panel[text] = pid


def main():
    cards = json.loads(CARDS_PATH.read_text(encoding="utf-8"))
    assets = []
    seen_action_art = {}  # descriptionRu -> asset id (dedup иконок действий)
    seen_panel = {}       # descriptionRu -> asset id (dedup панелей стрипов)

    for deck in cards.get("decks") or []:
        deck_id = deck["deckId"]
        for card in deck.get("cards") or []:
            process_card(card, {"deckId": deck_id}, deck_id, assets, seen_action_art, seen_panel)

    pinned = cards.get("pinnedRow") or {}
    for card in pinned.get("cards") or []:
        process_card(card, {"pinnedRow": True}, None, assets, seen_action_art, seen_panel)

    # рубашка карты — царапанный паттерн (meta.mechanics.handRefresh)
    assets.append(make_asset(
        "deck-art:card-back", "deck-art",
        {"mechanic": "handRefresh"},
        "рубашка карты — «сколотый»/царапанный паттерн; свежие карты показываются рубашкой до первого открытия",
        status="tbd", aspect="3:4",
    ))

    assets.sort(key=lambda a: (a["type"], a["id"]))

    doc = {"meta": META, "styleBlock": STYLE_BLOCK, "assets": assets}
    ASSETS_PATH.write_text(
        json.dumps(doc, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    by_type = Counter(a["type"] for a in assets)
    by_status = Counter(a["status"] for a in assets)
    print(f"OK: {ASSETS_PATH.relative_to(ROOT)} — всего ассетов: {len(assets)}")
    for t in sorted(by_type):
        print(f"  {t}: {by_type[t]}")
    for s in sorted(by_status):
        print(f"  status={s}: {by_status[s]}")


if __name__ == "__main__":
    main()
