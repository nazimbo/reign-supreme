// Fetches real Wikipedia thumbnail URLs for each leader and updates leaders.json
// Usage: node scripts/fetch-photos.mjs

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const leadersPath = join(__dirname, '../src/leaders.json');

// Map leader IDs to their Wikipedia article title
const wikiTitles = {
  1:  'Fidel_Castro',
  2:  'Kim_Il-sung',
  3:  'Muammar_Gaddafi',
  4:  'Omar_Bongo',
  5:  'Enver_Hoxha',
  6:  'Robert_Mugabe',
  7:  'Francisco_Franco',
  8:  'Josip_Broz_Tito',
  9:  'Mobutu_Sese_Seko',
  10: 'Suharto',
  11: 'Mao_Zedong',
  12: 'Joseph_Stalin',
  13: 'Saddam_Hussein',
  14: 'Nicolae_Ceau%C8%99escu',
  15: 'Augusto_Pinochet',
  16: 'Adolf_Hitler',
  17: 'Benito_Mussolini',
  18: 'Idi_Amin',
  19: 'Pol_Pot',
  20: 'Charles_de_Gaulle',
  21: 'Franklin_D._Roosevelt',
  22: 'Vladimir_Putin',
  23: 'Paul_Biya',
  24: 'Teodoro_Obiang_Nguema_Mbasogo',
  25: 'Ali_Khamenei',
  26: 'Fran%C3%A7ois_Mitterrand',
  27: 'Jacques_Chirac',
  28: 'Nelson_Mandela',
  29: 'Winston_Churchill',
  30: 'Hugo_Ch%C3%A1vez',
  31: 'Lee_Kuan_Yew',
  32: 'Mahathir_Mohamad',
  33: 'Elizabeth_II',
  34: 'Louis_XIV_of_France',
  35: 'Queen_Victoria',
  36: 'Hirohito',
  37: 'Angela_Merkel',
  38: 'Franz_Joseph_I_of_Austria',
  39: 'Ramesses_II',
  40: 'Pope_John_Paul_II',
  41: 'Augustus',
  42: 'Bhumibol_Adulyadej',
  43: 'Hassan_II_of_Morocco',
  44: 'Hussein_of_Jordan',
  45: 'F%C3%A9lix_Houphou%C3%ABt-Boigny',
  46: 'Haile_Selassie',
  47: 'Catherine_the_Great',
  48: 'Peter_the_Great',
  49: 'Kim_Jong-il',
  50: 'Kim_Jong-un',
  51: 'Alexander_the_Great',
  52: 'Julius_Caesar',
  53: 'Napoleon',
  54: 'Gamal_Abdel_Nasser',
  55: 'Hosni_Mubarak',
  56: 'Bashar_al-Assad',
  57: 'Hafez_al-Assad',
  58: 'Ferdinand_Marcos',
  59: 'Sukarno',
  60: 'Nursultan_Nazarbayev',
  61: 'Alexander_Lukashenko',
  62: 'Recep_Tayyip_Erdo%C4%9Fan',
  63: 'Margaret_Thatcher',
  64: 'Tony_Blair',
  65: 'Justin_Trudeau',
  66: 'Evo_Morales',
  67: 'Abraham_Lincoln',
  68: 'George_Washington',
  69: 'Emmanuel_Macron',
  70: 'Shinzo_Abe',
  71: 'Suleiman_the_Magnificent',
  72: 'Abdelaziz_Bouteflika',
  73: 'Genghis_Khan',
  74: 'Cleopatra',
  75: 'Charlemagne',
  76: 'Akbar',
  77: 'Kangxi_Emperor',
  78: 'Qin_Shi_Huang',
  79: 'Indira_Gandhi',
  80: 'Jawaharlal_Nehru',
  81: 'Kwame_Nkrumah',
  82: 'Patrice_Lumumba',
  83: 'Che_Guevara',
  84: 'Mahatma_Gandhi',
  85: 'Tokugawa_Ieyasu',
  86: 'Sim%C3%B3n_Bol%C3%ADvar',
  87: 'Nikita_Khrushchev',
  88: 'Leonid_Brezhnev',
  89: 'Mikhail_Gorbachev',
  90: 'Thomas_Sankara',
  91: 'Yasser_Arafat',
  92: 'Deng_Xiaoping',
  93: 'Xi_Jinping',
  94: 'Lech_Wa%C5%82%C4%99sa',
  95: 'V%C3%A1clav_Havel',
  96: 'Mustafa_Kemal_Atat%C3%BCrk',
  97: 'Nicholas_II_of_Russia',
  98: 'Otto_von_Bismarck',
  99: 'Leopold_II_of_Belgium',
  100: 'Fidel_V._Ramos',
};

async function fetchThumbnail(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'reign-supreme-game/1.0 (educational project)' }
    });
    if (!res.ok) {
      console.warn(`  HTTP ${res.status} for ${title}`);
      return null;
    }
    const data = await res.json();
    const src = data?.thumbnail?.source;
    if (!src) {
      console.warn(`  No thumbnail for ${title}`);
      return null;
    }
    // Resize to 320px width
    return src.replace(/\/\d+px-/, '/320px-');
  } catch (e) {
    console.warn(`  Error fetching ${title}: ${e.message}`);
    return null;
  }
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const leaders = JSON.parse(readFileSync(leadersPath, 'utf8'));

  for (const leader of leaders) {
    const title = wikiTitles[leader.id];
    if (!title) {
      console.log(`[${leader.id}] ${leader.name} — no title mapping, skipping`);
      continue;
    }
    process.stdout.write(`[${leader.id}] ${leader.name} ... `);
    const photo = await fetchThumbnail(title);
    if (photo) {
      leader.photo = photo;
      console.log('OK');
    } else {
      // Keep existing value (or clear it)
      console.log('FAILED (kept existing)');
    }
    await sleep(150); // be polite to Wikipedia
  }

  writeFileSync(leadersPath, JSON.stringify(leaders, null, 2) + '\n');
  console.log('\nDone — leaders.json updated.');
}

main();
