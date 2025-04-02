import { existsSync, promises as fsPromises } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sessionFolder = path.join(__dirname, '../ossessionbotSession/');
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 giorni in millisecondi

const handler = async (message, { conn, usedPrefix }) => {
    if (global.conn.user.jid !== conn.user.jid) {
        return conn.sendMessage(message.chat, {
            text: "*🚨 𝐔𝐭𝐢𝐥𝐢𝐳𝐳𝐢 𝐪𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐝𝐢𝐫𝐞𝐭𝐭𝐚𝐦𝐞𝐧𝐭𝐞 𝐧𝐞𝐥 𝐧𝐮𝐦𝐞𝐫𝐨 𝐝𝐞𝐥 𝐛𝐨𝐭.*"
        }, { quoted: message });
    }

    await conn.sendMessage(message.chat, {
        text: "⚡️ 𝐆𝐞𝐬𝐭𝐢𝐨𝐧𝐞 𝐝𝐞𝐥𝐥𝐞 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨... ⏳"
    }, { quoted: message });

    try {
        // Crea la cartella delle sessioni se non esiste
        if (!existsSync(sessionFolder)) {
            await fsPromises.mkdir(sessionFolder, { recursive: true });
            return await conn.sendMessage(message.chat, {
                text: "✅ 𝐂𝐚𝐫𝐭𝐞𝐥𝐥𝐚 𝐝𝐞𝐥𝐥𝐞 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢 𝐜𝐫𝐞𝐚𝐭𝐚. 𝐄𝐬𝐞𝐠𝐮𝐢 𝐧𝐮𝐨𝐯𝐚𝐦𝐞𝐧𝐭𝐞 𝐢𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨."
            }, { quoted: message });
        }

        const sessionFiles = await fsPromises.readdir(sessionFolder);
        let deletedCount = 0;

        // Pulizia automatica delle sessioni vecchie
        let autoCleanedCount = 0;
        for (const file of sessionFiles) {
            if (file !== "creds.json") {
                const filePath = path.join(sessionFolder, file);
                const stats = await fsPromises.stat(filePath);
                const fileAge = Date.now() - stats.mtimeMs; // Età del file in millisecondi

                if (fileAge > SESSION_MAX_AGE) {
                    try {
                        await fsPromises.unlink(filePath);
                        autoCleanedCount++;
                        console.log(`✅ Sessione vecchia eliminata automaticamente: ${file}`);
                    } catch (err) {
                        console.error(`❌ Errore durante l'eliminazione automatica di ${file}:`, err);
                    }
                }
            }
        }
        if (autoCleanedCount > 0) {
            await conn.sendMessage(message.chat, { text: `🧹 Sono state eliminate automaticamente ${autoCleanedCount} sessioni vecchie.` }, { quoted: message });
        }

        // Protezione da eliminazione accidentale
        await conn.sendMessage(message.chat, {
            text: "⚠️ 𝐒𝐞𝐢 𝐬𝐢𝐜𝐮𝐫𝐨 𝐝𝐢 𝐯𝐨𝐥𝐞𝐫 𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐫𝐞 𝐭𝐮𝐭𝐭𝐞 𝐥𝐞 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢 𝐦𝐚𝐧𝐮𝐚𝐥𝐦𝐞𝐧𝐭𝐞?\n𝐑𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐜𝐨𝐧 '𝐬𝐢' 𝐩𝐞𝐫 𝐜𝐨𝐧𝐟𝐞𝐫𝐦𝐚𝐫𝐞 𝐨 𝐜𝐨𝐧 '𝐧𝐨' 𝐩𝐞𝐫 𝐚𝐧𝐧𝐮𝐥𝐥𝐚𝐫𝐞."
        }, { quoted: message });

        const confirmation = await new Promise((resolve) => {
            conn.ev.on('messages.upsert', async ({ messages }) => {
                const response = messages[0];
                if (response.key.remoteJid === message.chat && !response.key.fromMe) {
                    const text = response.message?.conversation?.toLowerCase() || response.message?.extendedTextMessage?.text?.toLowerCase();
                    if (text === 'si' || text === 's') {
                        resolve('si');
                    } else if (text === 'no' || text === 'n') {
                        resolve('no');
                    } else {
                        conn.sendMessage(message.chat, { text: "Rispondi con 'si' o 'no'." }, { quoted: message });
                    }
                }
            });
        });

        if (confirmation === 'si') {
            // Eliminazione manuale delle sessioni
            for (const file of sessionFiles) {
                if (file !== "creds.json") {
                    try {
                        await fsPromises.unlink(path.join(sessionFolder, file));
                        deletedCount++;
                    } catch (err) {
                        console.error(`❌ Errore durante l'eliminazione di ${file}:`, err);
                        await conn.sendMessage(message.chat, { text: `❌ Errore durante l'eliminazione di ${file}` }, { quoted: message });
                    }
                }
            }

            const responseText = deletedCount === 0
                ? "❗ 𝐋𝐞 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢 𝐬𝐨𝐧𝐨 𝐯𝐮𝐨𝐭𝐞 ‼️"
                : `🔥 𝐒𝐨𝐧𝐨 state eliminate ${deletedCount} archivio/i delle sessioni!`;

            await conn.sendMessage(message.chat, { text: responseText }, { quoted: message });
        } else {
            await conn.sendMessage(message.chat, { text: "🚫 Eliminazione delle sessioni annullata." }, { quoted: message });
        }

    } catch (error) {
        console.error('⚠️ Errore durante l\'operazione sulle sessioni:', error);
        await conn.sendMessage(message.chat, { text: "❌ 𝐄𝐫𝐫𝐨𝐫𝐞 durante l'operazione sulle sessioni!" }, { quoted: message });
    }

    const botName = global.db.data.nomedelbot || "⟆ 𝑶𝑺𝑺𝑬𝑺𝑺𝑰𝑶𝑵𝑩𝑶𝑻 ⟇ ✦";
    const quotedMessage = {
        key: {
            participants: "0@s.whatsapp.net",
            fromMe: false,
            id: 'Halo'
        },
        message: {
            locationMessage: {
                name: botName,
                jpegThumbnail: await (await fetch("https://qu.ax/cSqEs.jpg")).buffer(),
                vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD"
            }
        },
        participant: '0@s.whatsapp.net'
    };

    await conn.sendMessage(message.chat, {
        text: "💌 𝐎𝐫𝐚 𝐬𝐚𝐫𝐚𝐢 𝐢𝐧 𝐠𝐫𝐚𝐝𝐨 𝐝𝐢 𝐥𝐞𝐠𝐠𝐞𝐫𝐞 𝐢 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢 𝐝𝐞𝐥 𝐛𝐨𝐭 🚀"
    }, { quoted: quotedMessage });
};

handler.help = ['del_reg_in_session_owner'];
handler.tags = ["owner"];
handler.command = /^(deletession|ds|clearallsession)$/i;
handler.admin = true;

export default handler;
