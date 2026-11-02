const { SlashCommandBuilder } = require("discord.js");
module.exports = {
 data: [
  new SlashCommandBuilder().setName("coinflip").setDescription("მონეტის აგდება"),
  new SlashCommandBuilder().setName("dice").setDescription("კამათლის გაგორება"),
  new SlashCommandBuilder().setName("8ball").setDescription("კითხე ჯადოსნურ ბურთს").addStringOption(o=>o.setName("question").setDescription("კითხვა").setRequired(true)),
  new SlashCommandBuilder().setName("rps").setDescription("ქვა, ქაღალდი, მაკრატელი").addStringOption(o=>o.setName("choice").setDescription("აირჩიე").setRequired(true).addChoices({name:"ქვა",value:"ქვა"},{name:"ქაღალდი",value:"ქაღალდი"},{name:"მაკრატელი",value:"მაკრატელი"}))
 ],
 async execute(i) {
  const n=i.commandName;
  if(n==="coinflip") return i.reply(Math.random()<0.5?"🪙 არწივი!":"🪙 საფასური!");
  if(n==="dice") return i.reply(`🎲 გაგორდა: **${1+Math.floor(Math.random()*6)}**`);
  if(n==="8ball") return i.reply(["კი.","არა.","შესაძლებელია.","მოგვიანებით სცადე.","ძალიან სავარაუდოა.","ამის თქმა ჯერ შეუძლებელია."][Math.floor(Math.random()*6)]);
  if(n==="rps") {
   const bot=["ქვა","ქაღალდი","მაკრატელი"][Math.floor(Math.random()*3)], you=i.options.getString("choice");
   const result=you===bot?"ფრე!":(you==="ქვა"&&bot==="მაკრატელი"||you==="ქაღალდი"&&bot==="ქვა"||you==="მაკრატელი"&&bot==="ქაღალდი")?"შენ მოიგე!":"ბოტმა მოიგო!";
   return i.reply(`შენი არჩევანი: **${you}**\nბოტის არჩევანი: **${bot}**\n**${result}**`);
  }
 }
};
