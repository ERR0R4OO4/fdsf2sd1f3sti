const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const mongoose = require(`mongoose`);
const { Permissions } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");
const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
});

setTimeout(() => {
  if (!client || !client.user) {
    console.log("Client Not Login, Process Kill");
    process.kill(1);
  } else {
    console.log("login Auto kill 1 ");
  }
}, 1 * 200 * 20);

const roleid = "1168176829912318002";

const app = require("express")();
app.get("/", (req, res) => res.send("Hello. im Ticket Claim Bot"));
app.listen(3000);

const db = require("pro.db");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  var member;
  let role = interaction.guild.roles.cache.find(
    (role) => role.id === `${roleid}`
  ); // ايدي رول اللى يستلم التكت
  await interaction.deferUpdate();
  if (interaction.isButton) {
    if (interaction.customId === `idk`) {
      if (
        interaction.member.roles.cache.some((role) => role.id === `${roleid}`)
      ) {
        // حط هنا ايدي الرتبة اللى تستلم التكت
        await interaction.message.delete();
        db.add(`point_${interaction.user.id}`, 1);
        const embed = new Discord.MessageEmbed()
          .setColor("#567a9d")
          .setDescription(
            `**لقد تم استلام التكت من قبل <@${interaction.user.id}>**`
          );
        const product = new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId("idk1")
            .setLabel("ترك التكت")
            .setStyle("DANGER")
        );

        interaction.channel.send({ embeds: [embed], components: [product] });
        const everyone = interaction.guild.roles.cache.find(
          (r) => r.id === `${roleid}`
        );
        let l1 = interaction.user;
        let l = l1;
        const filter = (i) =>
          i.customId === "idk1" && i.user.id === interaction.member.id;

        const collector = interaction.channel.createMessageComponentCollector({
          filter,
        });

        collector.on("collect", async (i) => {
          if (i.customId === "idk1") {
            if (
              interaction.member.roles.cache.some(
                (role) => role.id === `${roleid}`
              )
            ) {
              await i.message.delete();
              const embed = new Discord.MessageEmbed()
                .setColor("#567a9d")
                .setDescription(
                  `**لقد تم ترك التكت من قبل <@${interaction.user.id}>**`
                );

              const product = new MessageActionRow().addComponents(
                new MessageButton()
                  .setCustomId("idk")
                  .setLabel("استلام")
                  .setStyle("SUCCESS")
              );
              db.add(`point_${interaction.user.id}`, -1);
              interaction.channel.send({
                embeds: [embed],
                components: [product],
              });
              const everyone = interaction.guild.roles.cache.find(
                (r) => r.id === `${roleid}`
              );

              interaction.channel.permissionOverwrites.delete(
                interaction.member.id
              );
              const unclaim = "UnClaimed";
              interaction.channel.permissionOverwrites.edit(
                interaction.member.id,
                { SEND_MESSAGES: true }
              );

              interaction.channel.setName(interaction.user.username);
              interaction.channel.permissionOverwrites.edit(role, {
                SEND_MESSAGES: true,
              });
              interaction.channel.setName("تكت-غير-مستلم");
              collector.stop();
            } else {
              interaction.followUp({
                content: `ماشفتك تستخدم الزر ؟`,
                ephemeral: true,
              });

              return;
            }
          }
        });
        interaction.channel.permissionOverwrites.edit(interaction.member.id, {
          SEND_MESSAGES: true,
        });

        interaction.channel.setName(interaction.user.username);
        interaction.channel.permissionOverwrites.edit(`${roleid}`, {
          SEND_MESSAGES: false,
        });
      } else {
        interaction.followUp({
          content: `ماشفتك تستخدم الزر ؟`,
          ephemeral: true,
        });
        return;
      }
      return;
    }
  }
});

client.on(`message`, async (message) => {
  let args = message.content.trim().split(/ +/g);
  if (message.content.startsWith("نقاط")) {
    let user = message.mentions.members.first() || message.author;
    let usertickets1 = db.get(`point_${user.id}`);
    let embed1 = new MessageEmbed()
      .setFooter({
        text: message.author.username,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setAuthor({
        name: message.guild.name,
        iconURL: message.guild.iconURL({ dynamic: true }),
      })
      .setTimestamp(Date.now())
      .setColor("#567a9d")
      .setDescription(`**نقاطك ${usertickets1}**`);
    if (!user) return message.reply({ embeds: [embed1] });
    let usertickets = db.get(`point_${user.id}`);
    if (!db.has(`point_${user.id}`)) {
      let embed2 = new MessageEmbed()
        .setFooter({
          text: message.author.username,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setAuthor({
          name: message.guild.name,
          iconURL: message.guild.iconURL({ dynamic: true }),
        })
        .setTimestamp(Date.now())
        .setColor("#567a9d")
        .setDescription(`**عدد التكتات التي استلمها ${user} : \`0\`**`);
      db.set(`point_${user.id}`, 0);
      return message.reply({ embeds: [embed2] });
    }
    if (db.has(`point_${user.id}`)) {
      let embed3 = new MessageEmbed()
        .setFooter({
          text: message.author.username,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setAuthor({
          name: message.guild.name,
          iconURL: message.guild.iconURL({ dynamic: true }),
        })
        .setTimestamp(Date.now())
        .setColor("#567a9d")
        .setDescription(
          `**عدد التكتات التي استلمها ${user} : \`${usertickets}\`**`
        );
      return message.reply({ embeds: [embed3] });
    }
  }
});

client.on(`channelCreate`, async (ch) => {
  if ((ch.name.startsWith(`ticket-`), `-تذكرة`)) {
    const product = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("idk")
        .setLabel("استلام")
        .setStyle("SUCCESS")
    );

    const embed = new Discord.MessageEmbed()
      .setColor("#567a9d")
      .setDescription(`اضغط على الزر لـ استلام التكت`);

    await setTimeout(() => {
      ch.send({ embeds: [embed], components: [product] });
    }, 2000);
  }
});

client.on("messageCreate", (msg) => {
  if (msg.content.startsWith("اضافة")) {
    if (msg.author.id !== "1113517873135104071")
      return msg.channel.send(
        `**عزيزي العضو , لـسـت مـسـؤولاً لـ تـسـتـخـدم هـذا الامـر**`
      );
    const args = msg.content.split(" ").slice(2).join("") || Number();
    const mentionn = msg.mentions.users.first();

    if (!args) return msg.reply(`**اكتب عدد النقاط**`);
    const point = db.get(`point_${msg.member.id}`);

    if (isNaN(args)) {
      msg.channel.send("يرجى ادخال رقم صحيح");
    }
    if (!mentionn) {
      db.add(`point_${msg.user.id}`, args);
      msg.reply(`**تمت اضافة ${args} الى الأداري <@${msg.member.id}> **`);
    }

    db.add(`point_${mentionn.id}`, Number(args));
    msg.reply(`**تمت اضافة ${args} الى الأداري <@${msg.member.id}> **`);
  }
});

client.on("messageCreate", (message) => {
  if (message.content.startsWith("ازالة")) {
    if (message.author.id !== "1113517873135104071")
      return message.channel.send(
        `**عزيزي العضو , لـسـت مـسـؤولاً لـ تـسـتـخـدم هـذا الامـر**`
      );
    const args = message.content.split(" ").slice(2).join("");
    const mentionn = message.mentions.users.first();

    if (!args) return message.reply(`**اكتب عدد النقاط**`);
    const point = db.get(`point_${message.member.id}`);

    if (isNaN(args)) {
      message.channel.send("يرجى ادخال رقم صحيح");
    }
    if (!mentionn) {
      db.set(`point_${message.user.id}`, poin);
      message.reply(
        `**تمت ازالة ${args} من الأداري <@${message.member.id}> **`
      );
    }
    const poin = point - args || Number();
    db.set(`point_${mentionn.id}`, poin);
    message.reply(`**تمت ازالة ${args} من الأداري <@${message.member.id}> **`);
  }
});

client.on("message", (message) => {
  if (message.content.startsWith("خط")) {
    message.delete();
    message.channel.send({ files: [""] });
  }
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("توب")) {
    let data = db
      .all()
      .filter((data) => data[0].includes("point"))
      .map((data) => [data[0].split("_")[1], parseInt(data[1].split(" ")[2])])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .filter((data) => data[1] > 0)
      .map(async (data) => {
        let user = await client.users.fetch(data[0]);
        return {
          user: user
            ? user.id === data[0]
              ? user.toString()
              : user.username
            : "Unknown User#0000",
          points: data[1],
        };
      });

    let userData = await Promise.all(data);

    let embed = new MessageEmbed()
      .setAuthor({
        name: message.guild.name,
        iconURL: message.guild.iconURL({ dynamic: true }),
      })
      .setTitle("اكثر 10 اشخاص استلام لتكتات")
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(
        userData
          .map((data) => `**${data.user}** | **__${data.points}__**`)
          .join("\n") || "No Body Have point right now"
      )
      .setFooter({
        text: `Requested by ${message.author.username}`,
        iconURL: message.author.avatarURL({ dynamic: true }),
      });
    await message.reply({
      embeds: [embed],
      allowedMentions: { repliedUser: true, parse: ["users"] },
    });
  }
});

client.login(process.env.token);
