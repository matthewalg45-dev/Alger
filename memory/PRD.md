# Skyline Empire — Mobile (Expo)

## Original Problem Statement
Build the mobile (React Native / Expo) client for **Skyline Empire**, a 1926
Manhattan "Acquire"-style stock-speculation board game. The problem statement
pointed to a handoff file that was missing; the user supplied the live deployed
backend URL `https://acquire-game.emergent.host/api`. The mobile app is a
faithful, brand-consistent port that consumes this existing backend.

## Architecture
- **Frontend:** Expo Router (SDK 54), TypeScript. Art Deco design system
  (Playfair Display + Inter + Roboto Mono, navy/gold palette) matching the
  canonical web build.
- **Backend:** External live API (not local). Base URL in
  `EXPO_PUBLIC_GAME_API_URL`. All game logic (engine, AI personas, mergers,
  pricing, endgame) lives server-side.
- **State machine (per turn):** place → (found / merger tie → payout →
  share disposition) → buy (≤3) → end turn. AI turns are driven by polling
  `POST /games/:id/ai-step` until a human decision is required.

## API Contract (reverse-engineered)
- `GET /` config · `GET /games` list · `POST /games` create · `GET /games/:id`
- `DELETE /games/:id` · `POST .../place {tile}` · `.../found {chain_id}`
- `.../choose-acquirer {chain_id}` · `.../merger {sell,trade}`
- `.../confirm-payout` · `.../buy {purchases:{chain_id:qty}}`
- `.../endturn {declare_end}` · `.../ai-step` · `.../sabotage {target_player_id,target_chain_id}` · `.../rematch`

## User Personas
- **Solo strategist:** plays against 1–3 AI automatons (Baron/Broker/Raider/Speculator).
- **Hotseat group:** 2–4 humans passing one device.

## Implemented (2026-06)
- Boardroom home: title, Local Play, Rules, Resume/Ledger list (open + delete).
- Setup: 2–4 seats, human/automaton toggle, persona cycle, name edit,
  difficulty (Easy/Classic/Cutthroat). Keyboard-aware via keyboard-controller.
- Rules screen with full how-to-play + chain tiers.
- Game screen: live board grid, hand highlights, stock exchange strip,
  partners strip, ledger/history, contextual turn banner, deck counter.
- Decision sheets: Founding, Merger-Tie (choose acquirer), Payout,
  Share Disposition (sell/trade/keep), Buy (up to 3, endgame declare), Sabotage
  (rumor/raid/insider-tip), Game Over (standings + rematch).
- AI auto-stepping with "deliberating" indicator; hotseat-aware viewer.

## Backlog
- P1: local ledger stats / lifetime record per persona.
- P1: animated tile-placement + merger reveal (reanimated).
- P2: chain-skin cosmetic themes (Roaring 20s / Belle Époque).
- P2: tutorial walkthrough for first-time players.

## Next Tasks
- Broaden automated coverage of merger/endgame flows.
