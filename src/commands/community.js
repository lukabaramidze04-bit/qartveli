const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { read, write } = require("../core/db");
module.exports = {
 data: [
  new SlashCommandBuilder().setName("level").setDescription("ნახე შენი XP და ლეველი").addUserOption(o=>o.setName("user").setDescription("მომხმარებელი")),
  new SlashCommandBuilder().setName("leaderboard").setDescription("XP რეიტინგი"),
  new SlashCommandBuilder().setName("userinfo").setDescription("მომხმარებლის ინფორმაცია").addUserOption(o=>o.setName("user").setDescription("მომხმარებელი")),
  new SlashCommandBuilder().setName("serverinfo").setDescription("სერვერის ინფორმაცია"),
  new SlashCommandBuilder().setName("avatar").setDescription("ნახე ავატარი").addUserOption(o=>o.setName("user").setDescription("მომხმარებელი")),
  new SlashCommandBuilder().setName("poll").setDescription("შექმენი გამოკითხვა").addStringOption(o=>o.setName("question").setDescription("კითხვა").setRequired(true)),
  new SlashCommandBuilder().setName("suggest").setDescription("გაგზავნე იდეა").addStringOption(o=>o.setName("idea").setDescription("იდეა").setRequired(true)),
  new SlashCommandBuilder().setName("report").setDescription("დაარეპორტე მომხმარებელი").addUserOption(o=>o.setName("user").setDescription("მომხმარებელი").setRequired(true)).addStringOption(o=>o.setName("reason").setDescription("მიზეზი").setRequired(true)),
  new SlashCommandBuilder().setName("afk").setDescription("დააყენე AFK სტატუსი").addStringOption(o=>o.setName("reason").setDescription("მიზეზი")),
  new SlashCommandBuilder().setName("daily").setDescription("მიიღე ყოველდღიური XP ბონუსი"),
  new SlashCommandBuilder().setName("remind").setDescription("შეხსენება წუთებში").addIntegerOption(o=>o.setName("minutes").setDescription("1-10080").setMinValue(1).setMaxValue(10080).setRequired(true)).addStringOption(o=>o.setName("text").setDescription("შეხსენება").setRequired(true))
 ],
 async execute(i, client) {
  const n=i.commandName;
  if(n==="level"){ const u=i.options.getUser("user")||i.user, p=read("xp",{})[`${i.guild.id}:${u.id}`]||{xp:0,level:0}; return i.reply(`${u} — Level **${p.level}**, XP **${p.xp}**`); }
  if(n==="leaderboard"){ const db=read("xp",{}); const top=Object.entries(db).filter(([k])=>k.startsWith(`${i.guild.id}:`)).sort((a,b)=>b[1].xp-a[1].xp).slice(0,10); return i.reply(top.length?top.map(([k,v],x)=>`${x+1}. <@${k.split(":")[1]}> — Level ${v.level} (${v.xp} XP)`).join("\n"):"რეიტინგი ჯერ ცარიელია."); }
  if(n==="userinfo"){ const u=i.options.getUser("user")||i.user; return i.reply({embeds:[new EmbedBuilder().setTitle(u.tag).setThumbnail(u.displayAvatarURL()).setDescription(`ID: ${u.id}\nშექმნილია: <t:${Math.floor(u.createdTimestamp/1000)}:R>`)]}); }
  if(n==="serverinfo") return i.reply({embeds:[new EmbedBuilder().setTitle(i.guild.name).setThumbnail(i.guild.iconURL()).setDescription(`წევრები: ${i.guild.memberCount}\nარხები: ${i.guild.channels.cache.size}\nროლები: ${i.guild.roles.cache.size}`)]});
  if(n==="avatar"){ const u=i.options.getUser("user")||i.user; return i.reply(u.displayAvatarURL({size:1024})); }
  if(n==="poll"){ const m=await i.reply({content:`📊 **${i.options.getString("question")}**\n👍 — კი\n👎 — არა`,fetchReply:true}); await m.react("👍"); await m.react("👎"); return; }
  if(n==="suggest"){ const ch=client.config.suggestionChannelId?await i.guild.channels.fetch(client.config.suggestionChannelId):i.channel; await ch.send({embeds:[new EmbedBuilder().setTitle("ახალი იდეა").setDescription(i.options.getString("idea")).setFooter({text:`ავტორი: ${i.user.tag}`}).setColor(0x57F287)]}); return i.reply({content:"იდეა გაიგზავნა.",ephemeral:true}); }
  if(n==="report"){ const ch=client.config.reportChannelId?await i.guild.channels.fetch(client.config.reportChannelId):i.channel; await ch.send({embeds:[new EmbedBuilder().setTitle("რეპორტი").setDescription(`მომხმარებელი: ${i.options.getUser("user")}\nმიზეზი: ${i.options.getString("reason")}\nავტორი: ${i.user}`).setColor(0xED4245)]}); return i.reply({content:"რეპორტი გაიგზავნა.",ephemeral:true}); }
  if(n==="afk"){ const db=read("afk",{}); db[`${i.guild.id}:${i.user.id}`]=i.options.getString("reason")||"AFK"; write("afk",db); return i.reply("AFK სტატუსი ჩაირთო."); }
  if(n==="daily"){ const db=read("daily",{}), key=`${i.guild.id}:${i.user.id}`; if(db[key]&&Date.now()-db[key]<86400000) return i.reply({content:"დღიური ბონუსი უკვე აიღე. ხვალ სცადე.",ephemeral:true}); db[key]=Date.now(); write("daily",db); const xp=read("xp",{}), p=xp[key]||{xp:0,level:0,last:0}; p.xp+=50; xp[key]=p; write("xp",xp); return i.reply("🎁 მიიღე 50 XP!"); }
  if(n==="remind"){ const mins=i.options.getInteger("minutes"), msg=i.options.getString("text"); await i.reply({content:`შეხსენება დაყენებულია ${mins} წუთში.`,ephemeral:true}); setTimeout(()=>i.user.send(`⏰ შეხსენება: ${msg}`).catch(()=>{}),mins*60000); }
 }
};
