import 'os';
import 'util';
import 'human-readable';
import '@whiskeysockets/baileys';
import 'fs';
import 'perf_hooks';

let handler = async (m, { conn, usedPrefix }) => {
  let pp = './src/admins.jpg'; // Immagine predefinita
  try {
    pp = await conn.profilePictureUrl(m.sender, 'image');
  } catch (e) {
    // Ignora se non trova l'immagine del profilo
  }

  let menuAdmin = `
╔══════════════════════════╗
║  🚀   𝐌 𝐄 𝐍 𝐔    𝐀 𝐃 𝐌 𝐈 𝐍   🚀  ║
╚══════════════════════════╝

        𝗖𝗢𝗠𝗔𝗡𝗗𝗜 𝗔𝗗𝗠𝗜𝗡
╭━━━━━━━━━━━━━━━━━━━╮
┃ ⚡ ${usedPrefix}𝗣𝗥𝗢𝗠𝗨𝗢𝗩𝗜 / 𝗣
┃ ⚡ ${usedPrefix}𝗥𝗘𝗧𝗥𝗢𝗖𝗘𝗗𝗜 / 𝗥
┃ ⚡ ${usedPrefix}𝗪𝗔𝗥𝗡 / 𝗨𝗡𝗪𝗔𝗥𝗡 
┃ ⚡ ${usedPrefix}𝗠𝗨𝗧𝗔 / 𝗦𝗠𝗨𝗧𝗔 
┃ ⚡ ${usedPrefix}𝗠𝗨𝗧𝗘𝗟𝗜𝗦𝗧 
┃ ⚡ ${usedPrefix}𝗛𝗜𝗗𝗘𝗧𝗔𝗚 
┃ ⚡ ${usedPrefix}𝗧𝗔𝗚𝗔𝗟𝗟 
┃ ⚡ ${usedPrefix}𝗔𝗣𝗘𝗥𝗧𝗢 / 𝗖𝗛𝗜𝗨𝗦𝗢 
┃ ⚡ ${usedPrefix}𝗦𝗘𝗧𝗪𝗘𝗟𝗖𝗢𝗠𝗘 <𝘁𝗲𝘀𝘁𝗼>
┃ ⚡ ${usedPrefix}𝗦𝗘𝗧𝗕𝗬𝗘 <𝘁𝗲𝘀𝘁𝗼>
┃ ⚡ ${usedPrefix}𝗜𝗡𝗔𝗧𝗧𝗜𝗩𝗜 
┃ ⚡ ${usedPrefix}𝗟𝗜𝗦𝗧𝗔𝗡𝗨𝗠 + 𝗣𝗥𝗘𝗙𝗜𝗦𝗦𝗢 
┃ ⚡ ${usedPrefix}𝗣𝗨𝗟𝗜𝗭𝗜𝗔 + 𝗣𝗥𝗘𝗙𝗜𝗦𝗦𝗢 
┃ ⚡ ${usedPrefix}𝗥𝗜𝗠𝗢𝗭𝗜𝗢𝗡𝗘 𝗜𝗡𝗔𝗧𝗧𝗜𝗩𝗜 
┃ ⚡ ${usedPrefix}𝗦𝗜𝗠 
┃ ⚡ ${usedPrefix}𝗔𝗗𝗠𝗜𝗡𝗦 
┃ ⚡ ${usedPrefix}𝗙𝗥𝗘𝗘𝗭𝗘 @tag
┃ ⚡ ${usedPrefix}𝗜𝗦𝗣𝗘𝗭𝗜𝗢𝗡𝗔 <𝗹𝗶𝗻𝗸>
┃ ⚡ ${usedPrefix}𝗧𝗢𝗣 (10,50,100) 
┃ ⚡ ${usedPrefix}𝗧𝗢𝗣𝗦𝗘𝗫𝗬 
┃ ⚡ ${usedPrefix}𝗣𝗜𝗖 @tag
┃ ⚡ ${usedPrefix}𝗣𝗜𝗖𝗚𝗥𝗨𝗣𝗣𝗢 
┃ ⚡ ${usedPrefix}𝗡𝗢𝗠𝗘 <𝘁𝗲𝘀𝘁𝗼> 
┃ ⚡ ${usedPrefix}𝗕𝗜𝗢 <𝘁𝗲𝘀𝘁𝗼> 
┃ ⚡ ${usedPrefix}𝗟𝗜𝗡𝗞𝗤𝗥 
╰━━━━━━━━━━━━━━━━━━━╯

🔥 *⟆ 𝑶𝑺𝑺𝑬𝑺𝑺𝑰𝑶𝑵𝑩𝑶𝑻 ⟇ ✦* 🔥
`.trim();

  let infoBot = global.db.data.nomedelbot || " ⟆ 𝑶𝑺𝑺𝑬𝑺𝑺𝑰𝑶𝑵𝑩𝑶𝑻 ⟇ ✦ ";

  conn.sendMessage(m.chat, {
    image: { url: pp },
    caption: menuAdmin,
    footer: infoBot,
    templateButtons: [
      { urlButton: { displayText: 'Sito Web Ufficiale', url: 'https://example.com' } }, // Aggiungi qui il tuo sito web se ne hai uno
      { quickReplyButton: { displayText: 'Info Bot', id: `${usedPrefix}info` } },
      { quickReplyButton: { displayText: 'Regole Gruppo', id: `${usedPrefix}regole` } },
    ],
    contextInfo: {
      mentionedJid: conn.parseMention(menuAdmin),
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363387378860419@newsletter",
        serverMessageId: '',
        newsletterName: infoBot
      }
    }
  }, { quoted: m });
};

handler.help = ['menuadmin', 'adminmenu'];
handler.tags = ['admin'];
handler.command = /^(menuadmin|adminmenu)$/i;
handler.owner = true; // Solo per gli amministratori del bot

export default handler;

function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  console.log({ ms, h, m, s });
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}
