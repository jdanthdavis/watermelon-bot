const BossTimes = require('../../models/leaderBoard');
const { checkTime } = require('../checkTime');

module.exports = {
  submitTime: async (submission, user) => {
    let completed = false;
    const member = await submission.message.guild.members.fetch(user.id);
    const isApprover = member.roles.cache.some(
      (role) => role.name === 'leaderboard-approver'
    );
    const embed = submission.message.embeds;
    const {
      Submitter,
      Boss,
      Time: newTime,
      'Team Size': teamSize,
      'Team List': teamList,
    } = embed[0].data.fields.reduce((acc, curr) => {
      acc[curr.name] = curr.value;
      return acc;
    }, {});

    if (!isApprover) return;

    /**
     * Creates a new boss entry with the submitted time.
     */
    const addNewBossNewTime = () => {
      const newBoss = new BossTimes({
        bossName: Boss,
        times: [{ players: teamList, teamSize: teamSize, killTime: newTime }],
      });

      newBoss
        .save()
        .then(
          () => (completed = true),
          console.log(
            `New boss: ${Boss} has been added with a time of ${newTime}.`
          )
        )
        .catch((error) =>
          console.error(
            `Error adding ${Boss} with a time of ${newTime}, ${error}`
          )
        );
    };

    /**
     * Updates the submitted boss and pushes the new submission into the existing times array.
     */
    const addToExistingBoss = () => {
      const help = { players: teamList, teamSize: teamSize, killTime: newTime };
      BossTimes.updateOne(
        { bossName: Boss }, // Find the document with the matching bossName
        { $push: { times: help } } // Push the new time entry into the 'times' array
      )
        .then(() => {
          (completed = true),
            console.log(
              `${Boss}'s times have been updated with a submission time of ${newTime}.`
            );
        })
        .catch((error) => {
          console.error(
            `Error updating ${Boss}'s times with submission time of ${newTime}, ${error}`
          );
        });
    };

    /**
     * Updates a boss with already 3 records with the submitted one.
     */
    const addSubmittedTime = (recordToReplace) => {
      BossTimes.updateOne(
        { bossName: Boss, 'times._id': recordToReplace._id },
        {
          $set: {
            'times.$.players': teamList, // Replace 'players' value with new value
            'times.$.teamSize': teamSize, // Example: change teamSize
            'times.$.killTime': newTime, // Example: change killTime
          },
        }
      ).then((updatedResults) => {
        if (updatedResults) {
          completed = true;
          console.log('Updated!');
        }
      });
    };

    try {
      BossTimes.find({ bossName: Boss }).then((boss) => {
        const bossLength = boss[0]?.times?.length;
        if (bossLength === 0 || !bossLength) {
          // When the submitted boss isn't in the db.
          addNewBossNewTime();
        } else if (bossLength < 3) {
          // Update the existing boss since there's less than 3 records for that boss.
          addToExistingBoss();
        } else {
          // Check if the submitted time is faster than the 3 records in the db.
          const recordToReplace = checkTime(boss[0].times, newTime);

          if (!recordToReplace) {
            //TODO: Maybe we shoul have the bot reply here?
            console.log('No times are beat by the submitted time.');
            return;
          } else if (recordToReplace === 'Exact') {
            console.log('Submitted time was an exact match to all records.');
            return;
          } else if (recordToReplace === 'invalidTime') {
            console.log('Submitted time has an invalid time format.');
            return;
          }
          addSubmittedTime(recordToReplace);
        }
      });
    } catch (error) {
      console.error(error);
    }
    return completed;
  },
};
