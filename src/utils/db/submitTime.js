const BossTimes = require('../../models/leaderBoard');
const { checkTime } = require('../checkTime');
const { raidPartyFinder } = require('../raidPartyFinder');

module.exports = {
  submitTime: async (submission, user) => {
    const message = submission.message;
    let completed = false;
    const member = await submission.message.guild.members.fetch(user.id);
    const isApprover = member.roles.cache.some(
      (role) => role.name === 'leaderboard-approver'
    );
    const embed = submission.message.embeds;
    const embedFields = embed[0].data.fields.reduce((acc, curr) => {
      acc[curr.name] = curr.value;
      return acc;
    }, {});

    const {
      Time: newTime,
      'Team Size': teamSize,
      'Team List': teamList,
    } = embedFields;

    // Find the party size if it's a raid
    const Boss = raidPartyFinder(embedFields.Boss, teamSize);

    if (!isApprover) return;

    /**
     * Creates a new boss entry with the submitted time.
     */
    const addNewBossNewTime = async () => {
      const newBoss = new BossTimes({
        bossName: Boss,
        times: [{ players: teamList, teamSize: teamSize, killTime: newTime }],
      });

      try {
        await newBoss.save();
        completed = true;
        console.log(
          `New boss: ${Boss} has been added with a time of ${newTime}.`
        );
      } catch (error) {
        console.error(
          `Error adding ${Boss} with a time of ${newTime}, ${error}`
        );
      }
    };

    /**
     * Updates the submitted boss and pushes the new submission into the existing times array.
     */
    const addToExistingBoss = async () => {
      const help = { players: teamList, teamSize: teamSize, killTime: newTime };
      BossTimes.updateOne(
        { bossName: Boss }, // Find the document with the matching bossName
        { $push: { times: help } } // Push the new time entry into the 'times' array
      );

      try {
        completed = true;
        console.log(
          `${Boss}'s times have been updated with a submission time of ${newTime}.`
        );
      } catch (error) {
        console.error(
          `Error updating ${Boss}'s times with submission time of ${newTime}, ${error}`
        );
      }
    };

    /**
     * Updates a boss with already 3 records with the submitted one.
     */
    const addSubmittedTime = async (recordToReplace) => {
      try {
        const updatedResults = await BossTimes.updateOne(
          { bossName: Boss, 'times._id': recordToReplace._id },
          {
            $set: {
              'times.$.players': teamList, // Replace 'players' value with new value
              'times.$.teamSize': teamSize, // Example: change teamSize
              'times.$.killTime': newTime, // Example: change killTime
            },
          }
        );
        if (updatedResults) {
          completed = true;
          console.log('Updated!');
        }
      } catch (error) {
        console.error(
          `Error updating ${Boss} with a submitted time of ${newTime}, ${error}`
        );
      }
    };

    try {
      const boss = await BossTimes.find({ bossName: Boss });
      const bossLength = boss[0]?.times?.length;
      if (boss?.length === 0) {
        // When the submitted boss isn't in the db.
        await addNewBossNewTime();
      } else if (bossLength < 3) {
        // Update the existing boss since there's less than 3 records for that boss.
        await addToExistingBoss();
      } else {
        // Check if the submitted time is faster than the 3 records in the db.
        const recordToReplace = checkTime(boss[0].times, newTime);

        if (!recordToReplace || recordToReplace === 'Exact') {
          message.reply(
            'Submission processed successfully but this submission does not beat any current records.'
          );
          return;
        } else if (recordToReplace === 'invalidTime') {
          message.reply('Submitted time has an invalid time format.');
          return;
        }
        await addSubmittedTime(recordToReplace);
      }
    } catch (error) {
      console.error(error);
    }
    return completed;
  },
};
