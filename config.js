/* Radar site settings. Fill these in, then run `python3 build.py --push`.
   Every page reads them, so each value lives in one place only. */
window.RADAR = {
  // Google Apps Script web app URL that saves each lead to the Google Sheet and emails it (ends with /exec).
  leadEndpoint: 'https://script.google.com/macros/s/AKfycbwvslckt7dJOe1Mh4wbFxwtbibtftqui1PkG2V6xa8IJ0AfyTnz3_54p_p7ssux2yM/exec',
  // Meta Pixel ID, numbers only. Leave empty until the pixel exists: nothing loads without it.
  pixelId: '1576308963443590',
  // WhatsApp number that receives chats: digits only, country code first, e.g. '96170123456'.
  whatsapp: '',
  // Social pages, shown on the thank-you page once filled in.
  instagram: '',
  facebook: '',
  // Business hours in Beirut time, used by the thank-you page for the 2-hour promise.
  // Day numbers: 1 = Monday ... 6 = Saturday, 0 = Sunday. [open hour, close hour], 24h clock.
  hours: { 1: [9, 18], 2: [9, 18], 3: [9, 18], 4: [9, 18], 5: [9, 18], 6: [9, 14] },
  replyWithinHours: 2,
};
