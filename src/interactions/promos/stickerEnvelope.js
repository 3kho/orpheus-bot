import { transcript, airFind, getInfoForUser } from '../../utils'
import interactionMailMission from '../mailMission'
import interactionTutorial from '../tutorial'
import interactionAddress from '../address'

export const names = ['Sticker Envelope']
export const details =
  'Available to active club leaders.'
export async function run(bot, message) {

  const creator = await getInfoForUser(message.user)

  if (!creator.leader || !creator.club) {
    await bot.replyPrivateDelayed(message, transcript('promos.stickerEnvelope.notAuthorized'))
    return
  }

  const recipientID = message.text.replace(/sticker envelope/i, '').trim()

  if (!recipientID) {
    await bot.replyPrivateDelayed(message, transcript('promos.stickerEnvelope.help', { user: message.user, email: creator.person.fields['Email'] }))
    return
  }

  let recipientRecord
  const slackRegex = /<@(.+)[|]*.*>/
  if (slackRegex.test(recipientID)) {
    let slackID = recipientID.match(slackRegex)[1]
    recipientRecord = (await getInfoForUser(slackID)).person
  } else {
    recipientRecord = await airFind('People', 'Email', recipientID)
  }

  if (recipientRecord.mailMissions) {
    console.log(recipientRecord.mailMissions.length)
  }

  await Promise.all([
    interactionMailMission(undefined, {
      user: recipientID,
      text: 'sticker envelope',
      note: ''
    }),
    bot.replyPrivateDelayed(message, transcript('promos.stickerEnvelope.success'))
  ])

  // const formula = `AND(${[
  //   `{Scenario Name}='Sticker Envelope'`,
  //   `{Receiver Address}='${personAddress.fields['ID']}'`,
  //   `OR('1 Unassigned'={Status},'2 Assigned'={Status},'3 Purchased'={Status})`,
  // ].join(',')})`
  // const existingMission = await airFind('Mail Missions', formula)

  // const note = message.text.replace(/sticker envelope/i, '')

  // if (existingMission) {
  //   await bot.replyPrivateDelayed(
  //     message,
  //     transcript('promos.stickerEnvelope.alreadyOrdered')
  //   )
  // } else {
  //   await interactionMailMission(undefined, {
  //     user,
  //     text: 'sticker_envelope',
  //     note,
  //   })

  //   await bot.replyPrivateDelayed(
  //     message,
  //     transcript('promos.stickerEnvelope.success')
  //   )
  // }

  // if (personAddress.fields['Missing Fields']) {
  //   await interactionAddress(bot, message)
  // }

  await interactionTutorial(bot, message)
}
