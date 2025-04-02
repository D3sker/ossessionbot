import { getDevice } from '@whiskeysockets/baileys';
import PhoneNumber from 'awesome-phonenumber';

const handler = async (m, { conn }) => {
  try {
    const mention = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;

    if (!global.db.data.users[mention]) {
      global.db.data.users[mention] = {
        name: "Sconosciuto",
        messaggi: 0,
        warn: 0,
        warnlink: 0,
        muto: false,
        banned: false,
        command: 0,
        age: "Non specificata", // Età predefinita più neutra
        gender: "Non specificato",
        instagram: "",
        bio: "Nessuna bio impostata.",
        categoria: "Utente",
        lastSeen: null,
        registratoIl: Date.now() // Data di registrazione
      };
    }
    const userData = global.db.data.users[mention];

    let bio = "";
    try {
      const status = await conn.fetchStatus(mention);
      bio = status?.status || userData.bio || "Nessuna bio impostata.";
    } catch {
      bio = userData.bio || "Nessuna bio impostata.";
    }

    const nome = userData.name || "Sconosciuto";
    const numero = PhoneNumber(mention.split("@")[0], "IT").getNumber("international");
    const dispositivo = await getDevice(m.key.id) || "Sconosciuto";

    let categoria = userData.categoria || "Utente";
    let categoriaEmoji = "";
    switch (categoria) {
      case "Utente":
        categoriaEmoji = "👤";
        break;
      case "Amico":
        categoriaEmoji = "🌟";
        break;
      case "VIP":
        categoriaEmoji = "👑";
        break;
      default:
        categoriaEmoji = "🏷️";
        break;
    }

    const stato = userData.muto ? "🔇 Muto" : userData.banned ? "🚫 Bannato" : "✅ Attivo";
    const lastAccess = userData.lastSeen ? new Date(userData.lastSeen).toLocaleString('it-IT') : "Non disponibile";
    const instagramLink = userData.instagram ? `📸 *Instagram:* [@${userData.instagram}](https://instagram.com/${userData.instagram})\n` : '';
    const registratoIl = userData.registratoIl ? new Date(userData.registratoIl).toLocaleString('it-IT') : "Non disponibile";

    let profilo;
    try {
      profilo = await conn.profilePictureUrl(mention, 'image');
    } catch {
      profilo = 'https://telegra.ph/file/560f1667a55ecf09650cd.png';
    }

    const messaggio = `╭───〔 📌 *INFO UTENTE* 📌 〕───╮\n` +
      `📛 *Nome:* ${nome}\n` +
      `🏷️ *Numero:* ${numero}\n` +
      `📱 *Dispositivo:* ${dispositivo}\n` +
      `🏆 *Categoria:* ${categoriaEmoji} ${categoria}\n` +
      `🛡️ *Stato:* ${stato}\n` +
      `📊 *Messaggi:* ${userData.messaggi}\n` +
      `⌨️ *Comandi usati:* ${userData.command}\n` +
      `⚠️ *Warn:* ${userData.warn} / 5\n` +
      `📆 *Età:* ${userData.age}\n` +
      `🚻 *Genere:* ${userData.gender}\n` +
      `🗓️ *Registrato il:* ${registratoIl}\n` +
      `📝 *Bio:* ${bio}\n` +
      `⏱️ *Ultimo accesso:* ${lastAccess}\n` +
      instagramLink +
      `╰───────────────────────╯`;

    await conn.sendMessage(m.chat, {
      text: messaggio,
      contextInfo: {
        mentionedJid: [mention],
        externalAdReply: {
          title: `${nome} | ${userData.age} | ${userData.gender} | ${categoria}`,
          body: bio,
          sourceUrl: "https://wa.me/" + mention.split("@")[0],
          thumbnail: await (await fetch(profilo)).buffer()
        }
      }
    }, { quoted: m });

  } catch (error) {
    console.error("Errore in USERINFO:", error);
    await conn.sendMessage(m.chat, { text: "❌ Errore nel recuperare le informazioni dell'utente." }, { quoted: m });
  }
};

handler.command = /^(userinfo|infoutente|profilo)$/i;
export default handler;
