// Tento blok pridaj do node:
// Code - Telegram Wizard State Machine
//
// Umiestni ho hneď po:
// const message = update.message || update.edited_message || {};
// const chatId = message.chat?.id;
// const text = String(message.text || '').trim();

const webAppData = message.web_app_data?.data;

if (webAppData) {
  let payload;

  try {
    payload = JSON.parse(webAppData);
  } catch (error) {
    return [{
      json: {
        action: 'ASK',
        chatId,
        replyText: 'Mini App poslala neplatné dáta. Skús formulár odoslať znova.'
      }
    }];
  }

  if (payload.type === 'ryanair_search') {
    return [{
      json: {
        action: 'SEARCH',
        chatId,
        ORIGIN_IATA: String(payload.origin || '').toUpperCase(),
        DESTINATION_IATA: String(payload.destination || '').toUpperCase(),
        OUTBOUND_DATE: payload.outboundDate,
        RETURN_DATE: payload.returnDate,
        FLEX_DAYS: Number(payload.flexDays ?? 1),
        CURRENCY: 'EUR',
        MARKET: 'sk-sk',
        LANGUAGE: 'sk',
        LIMIT: 50,
        PRICE_VALUE_TO: 999,
        ALERT_TOTAL_PRICE_MAX: Number(payload.alertTotalPriceMax || 999)
      }
    }];
  }

  return [{
    json: {
      action: 'ASK',
      chatId,
      replyText: 'Mini App poslala neznámy typ požiadavky.'
    }
  }];
}
