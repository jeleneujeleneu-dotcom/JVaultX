# JVaultX — Sell.app Setup Guide

Tento průvodce ti vysvětlí krok za krokem, jak propojit JVaultX shop s tvojím sell.app účtem.

---

## 1) Vytvoření sell.app účtu

1. Jdi na **https://sell.app**
2. Klikni **Sign up** a založ si free účet
3. Po loginu si zvolíš **store slug** (subdoménu), např. `jvaultx` → bude přístupný na `https://jvaultx.sell.app`

---

## 2) Nastav slug v JVaultX

Otevři soubor `/app/frontend/src/mock.js` a najdi sekci:

```js
export const SELL_APP = {
  storeSlug: 'jvaultx',           // ← TVŮJ SLUG
  baseUrl: 'https://jvaultx.sell.app',  // ← TVŮJ BASE URL
};
```

Změň hodnoty na své reálné. Po uložení proběhne hot-reload.

---

## 3) Nastav platební bránu v sell.app

V sell.app dashboardu:

1. **Settings → Payments** → propoj **Stripe** (karty) a/nebo **PayPal** a/nebo **Crypto** (Coinbase Commerce, NowPayments)
2. Bez minimálně jedné platební metody nelze přijímat platby

---

## 4) Vytvoř produkty v sell.app

Tady je důležité: **JVaultX má vlastní katalog produktů** (v admin panelu), ale **sell.app musí vědět co inkasovat**.

### Možnost A — Univerzální produkt "Order Payment" (DOPORUČENO pro MVP)

Nejjednodušší přístup:

1. V sell.app vytvoř jeden produkt: **"JVaultX Order"** s cenou `$0.01` (custom amount enabled)
2. V sell.app **Settings → Custom amounts** povol custom price input
3. Zákazník při checkoutu zadá celkovou částku z JVaultX (např. `$23.45`)

Výhoda: nemusíš synchronizovat produkty mezi shopy.
Nevýhoda: zákazník musí ručně zadat částku → riziko chyby.

### Možnost B — Synchronizovaný katalog

1. Pro každý JVaultX produkt vytvoř odpovídající sell.app produkt se stejnou cenou
2. Do `mock.js` přidej k produktu `sellAppListingId: '12345'`
3. Při checkoutu se vytvoří sell.app košík s konkrétními ID
4. Vyžaduje úpravu kódu (přidat field do admin panelu a do checkout URL)

---

## 5) Nastav Return URL (KRITICKÉ)

Aby se po platbě objednávka v JVaultX automaticky označila jako **zaplacená**, musíš v sell.app nastavit:

1. **Settings → Webhooks** (nebo **Return URLs**)
2. **Success URL**: `https://TVUJ-WEB.com/payment-success?status=success`
3. **Cancel URL**: `https://TVUJ-WEB.com/payment-success?status=cancelled`

> ⚠️ Bez Return URL se objednávka v JVaultX nikdy nestane "paid" — zůstane v "pending checkout" navždy.

---

## 6) Limity současné implementace (frontend-only)

Tato verze JVaultX je **bez backendu**, takže:

- ✅ Order data se ukládají v `localStorage` prohlížeče zákazníka
- ✅ Po návratu z `/payment-success?status=success` se z pending checkoutu vytvoří paid order
- ❌ **NELZE ověřit, že platba skutečně proběhla** — kdokoliv může otevřít URL `/payment-success?status=success` a vytvořit fake order
- ❌ Sell.app webhooky nemůže zpracovávat (potřeba backend endpoint)
- ❌ Data jsou pouze lokální (jiný browser = žádné objednávky)

### Co potřebuješ pro produkci:

1. **Backend** (např. FastAPI/Node.js) s endpointy:
   - `POST /api/checkout/create` → vytvoří pending order + sell.app invoice přes Sell.app Invoice API
   - `POST /api/webhooks/sellapp` → přijme webhook, ověří signature, označí order jako paid
2. **Database** (MongoDB/PostgreSQL) místo localStorage
3. **Sell.app API key** v `.env`

Pokud chceš plnou produkční verzi, řekni mi a doplním backend s reálnou Sell.app Invoice API integrací.

---

## 7) Testování flow

1. Přihlas se jako `admin` / `admin123`
2. Přidej položky do košíku (alespoň $5)
3. Jdi na checkout → vyplň údaje → klikni Pay
4. Budeš redirectnut na sell.app
5. **Pro test**: po sell.app platbě se vrátíš na `/payment-success?status=success`
6. Order se objeví v Admin → Orders se statusem `paid`
7. Admin nebo Delivery user může editovat coords/notes a změnit status na `delivered`

---

## 8) Promo kódy a slevy

Diskount kódy se spravují v **Admin → Discounts**:

- **Code**: text, který zákazník zadá (např. `SAVE10`)
- **Type**: `Percent` (10% z subtotalu) nebo `Fixed USD` (přímá sleva)
- **Value**: hodnota slevy
- **Expires At**: datum expirace (volitelné)
- **Max Uses**: limit použití (`0` = neomezeno)

Kód platí automaticky před fee za delivery/priority. Sleva se počítá ze subtotalu, ne z celkové částky včetně poplatků.

---

## Kontakt
Pokud něco nefunguje, zkontroluj:
- Browser console (F12) pro chyby
- Že sell.app slug v `mock.js` odpovídá realitě
- Že Return URL v sell.app je správně nastavené
