framework.hears(/login/, function (bot, trigger) {
    console.log("someone called for login");
    responded = true;
    let email = trigger.person.emails[0];
    bot.say(`Sending ${trigger.person.displayName} a card privately.`)
      .then(() =>dmPassword(bot, email))
      .catch((e) => console.error(`Problem in help hander: ${e.message}`));
  });

  function dmPassword(bot, email){
    var newdate = new Date()
    var datestr = JSON.stringify(newdate)
    var dateObj = JSON.parse(datestr)
    let cutdate = dateObj.substring(0,10)
    console.log("cutdate: " + cutdate + ", " + datestr)
    bot.dmCard(
      email,
      {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.2",
        "body": [
          {
            "type": "TextBlock",
            "text": "Login",
            "wrap": true,
            "weight": "bolder",
            "size": "medium"
        },
            {
                "type": "TextBox",
                "text": "Please Enter the Tasks For Today:",
                "wrap": true
            },
            {
                "type": "Input.Text",
                "id": "password",
                "placeholder": "Please Enter Password for Login"
               
            }
        ],
        "actions": [
            {
                "type": "Action.Submit",
                "title": "Submit",
                "wrap": "true"
            },
        ]
      },
          "This is the fallback text if the client can't render this card");
      }