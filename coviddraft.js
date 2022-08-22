framework.hears(/create vaccination survey/, function (bot, trigger) {
    console.log("covid survey qn card here");
    responded = true;
    //funcnewcard(bot.sendCard(newcardJSON,'This is customizable fallback text for clients that do not support buttons & cards'));
    bot.sendCard(covidqnsCARD, 'This is customizable fallback text for clients that do not support buttons & cards')
  
  });
  
  let covidqnsCARD =
  {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.0",
    "body": [
      {
        "type": "ColumnSet",
        "columns": [
          {
            "type": "Column",
            "width": 2,
            "items": [
              {
                "type": "TextBlock",
                "text": "Create Survey",
                "weight": "bolder",
                "size": "medium"
              },
              {
                "type": "TextBlock",
                "text": "This survey is to be sent to your respective employees. Please input your questions you want to add into your survey.",
                "isSubtle": true,
                "wrap": true
              },
  
  
              {
                "type": "TextBlock",
                "text": 'Survey Code',
                "wrap": true
              },
              {
                "type": "Input.Number",
                "id": "ccode", // put input in here without quotes (storing name as data in db rn)
                "placeholder": "Enter survey code here"
              },
              {
                "type": "TextBlock",
                "text": 'Title',
                "wrap": true
              },
              {
                "type": "Input.Text",
                "id": "ctitle", // put input in here without quotes (storing name as data in db rn)
                "placeholder": "Enter title here"
              },
              {
                "type": "TextBlock",
                "text": 'Description',
                "wrap": true
              },
              {
                "type": "Input.Text",
                "id": "cdescription", // put input in here without quotes (storing name as data in db rn)
                "placeholder": "Enter description here"
              },
              {
                "type": "TextBlock",
                "text": "Question 1",
                "wrap": true
              },
              {
                "type": "Input.Text",
                "id": "cqn1"
              },
              {
                "type": "TextBlock",
                "text": "Question 2",
                "wrap": true
              },
              {
                "type": "Input.Text",
                "id": "cqn2",
              },
              {
                "type": "TextBlock",
                "text": "Question 3"
              },
              {
                "type": "Input.Text",
                "id": "cqn3"
              },
              {
                "type": "TextBlock",
                "text": "Question 4"
              },
              {
                "type": "Input.Text",
                "id": "cqn4"
              },
              {
                "type": "TextBlock",
                "text": "Question 5"
              },
              {
                "type": "Input.Text",
                "id": "cqn5"
              },
  
            ]
          },
  
        ]
      }
    ],
    "actions": [
      {
        "type": "Action.Submit",
        "title": "Submit",
        "id": "covidqncardID"
      }
    ]
  }
  
  
  
  framework.hears(/send vaccination survey/, function (bot, trigger) {
    console.log("in sendcovidsurvey");
    responded = true;
    let botName = bot.person.displayName; 
    surmsg = `Please enter the survey code that you want everyone to respond to. \nDon't forget to *@${botName}* at the start of your response.`;
    bot.say('markdown', surmsg)
      .then(() => newsurveycode());
    //.then(() => surveycode());
  
  });
  
  function newcovidcode() {
    responded = true;
    console.log("in newcovidcode here func")
    framework.hears(/[1-9][0-9]/i, function (bot, trigger) {
      console.log("in newcovidcode here")
      responded = true;
      var usersearch = trigger.text
      var usersearchStr = JSON.stringify(usersearch)
      var usersearchObj = JSON.parse(usersearchStr)
      let newusersearchstr = usersearchObj.substring(7)
      console.log("this here:" + newusersearchstr)
      //console.log("user search for: " + trigger.text + " ||" + newusersearchstr )
      responded = true;
  
      //add below here
      CovidQuestions.findOne({
        where: {
          ccode: newusersearchstr
        }, raw: true
      }).then((covidquestions) => {
        //console.log("the code: " + surveyquestions + " | " + surveyquestions.scode)
  
        //@everyone here and send the survey out --> 
  
        if (covidquestions) {
          // let ansename = trigger.person.displayName
          // let ansemail = trigger.person.emails[0]
          let ansscode = covidquestions.ccode
          let anstitle = surveyquestions.ctitle
          let ansdescr = surveyquestions.cdescription
          let ansques1 = surveyquestions.cqn1
          let ansques2 = surveyquestions.cqn2
          let ansques3 = surveyquestions.cqn3
          let ansques4 = surveyquestions.cqn4
          //let ansques5 = surveyquestions.sqn5
          bot.say("Hello everyone. Please respond to survey #" + ansscode + ". I will send it to your private message shortly.")
          //read everyone in room (say hi to everyone), then add below function inside the loop 
          //sendsurvey(bot, ansename, ansemail, ansscode, anstitle, ansdescr, ansques1, ansques2, ansques3, ansques4, ansques5)
  
          //get name and email by looping throguh everyone 
          bot.webex.memberships.list({ roomId: bot.room.id })
            .then((memberships) => {
              for (const member of memberships.items) {
                if (member.personId === bot.person.id) {
                  // Skip myself!
                  console.log("inside the forloop in survey")
                  continue;
                }
                let ansename = (member.personDisplayName) ? member.personDisplayName : member.personEmail;
                let ansemail = (member.personEmail) ? member.personEmail : member.personDisplayName;
                //bot.say(`Hello ${ansename}, this is your email ${ansemail}.`)
                console.log(ansename, ansemail, ansscode, anstitle, ansdescr, ansques1, ansques2, ansques3, ansques4, ansques5)
                sendsurvey(bot, ansename, ansemail, ansscode, anstitle, ansdescr, ansques1, ansques2, ansques3, ansques4, ansques5)
              }
            })
            .catch((e) => {
              //console.error(`Call to sdk.memberships.get() failed: ${e.messages}`);
              bot.say('Hello everybody!');
            });
  
  
  
  
        } else {
          bot.say("Invalid survey code.")
        }
  
      }).catch(err => console.log(err));
    });
  }
  
  
  function sendcovidsurvey(bot, ansename, ansemail, ansscode, anstitle, ansdescr, ansques1, ansques2, ansques3, ansques4, ansques5) {
    //let answersurCARD = {card}
    bot.dmCard(
      ansemail,
      {
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.0",
        "body": [
          {
            "type": "ColumnSet",
            "columns": [
              {
                "type": "Column",
                "width": 2,
                "items": [
                  {
                    "type": "TextBlock",
                    "text": anstitle,
                    "weight": "bolder",
                    "size": "medium"
                  },
                  {
                    "type": "TextBlock",
                    "text": "Hello " + ansename,
                    "isSubtle": true,
                    "wrap": true
                  },
                  {
                    "type": "TextBlock",
                    "text": ansdescr + " (Survey Code: " + ansscode + ")",
                    "isSubtle": true,
                    "wrap": true
                  },
  
                  {
                    "type": "Input.Text",
                    "id": "cname", // put input in here without quotes (storing name as data in db rn)
                    "value": ansename,
                    "isVisible": false
                  },
                  {
                    "type": "Input.Number",
                    "id": "csurcode", // put input in here without quotes (storing name as data in db rn)
                    "value": ansscode,
                    "isVisible": false
                  },
                  {
                    "type": "Input.Text",
                    "id": "cemail", // put input in here without quotes (storing name as data in db rn)
                    "value": ansemail,
                    "isVisible": false
                  },
  
                  {
                    "type": "TextBlock",
                    "text": ansques1,
                    "wrap": true
                  },
                  {
                    "type": "Input.Text",
                    "id": "cq1", // put input in here without quotes (storing name as data in db rn)
                    "placeholder": "Enter your answer here"
                  },
                  {
                    "type": "TextBlock",
                    "text": ansques2,
                    "wrap": true
                  },
                  {
                    "type": "Input.Text",
                    "id": "cq2", // put input in here without quotes (storing name as data in db rn)
                    "placeholder": "Enter your answer here"
                  },
                  {
                    "type": "TextBlock",
                    "text": ansques3,
                    "wrap": true
                  },
                  {
                    "type": "Input.Text",
                    "id": "cq3", // put input in here without quotes (storing name as data in db rn)
                    "placeholder": "Enter your answer here"
                  }, {
                    "type": "TextBlock",
                    "text": ansques4,
                    "wrap": true
                  },
                  {
                    "type": "Input.Text",
                    "id": "cq4", // put input in here without quotes (storing name as data in db rn)
                    "placeholder": "Enter your answer here"
                  },
                  {
                    "type": "TextBlock",
                    "text": ansques5,
                    "wrap": true
                  },
                  {
                    "type": "Input.Text",
                    "id": "cq5", // put input in here without quotes (storing name as data in db rn)
                    "placeholder": "Enter your answer here"
                  },
  
                ]
              },
  
            ]
          }
        ],
        "actions": [
          {
            "type": "Action.Submit",
            "title": "Submit",
            "id": "surveyqncardID"
          }
        ]
      }
    )
  }
  
  framework.hears(/covid survey responses/i, function (bot, trigger) {
    console.log("this is inside surveyresponse.");
    responded = true;
  
    let botName = bot.person.displayName;
    surveycovidmsg = `Enter the survey code of the responses that you want to retrieve.  \nDon't forget to *@${botName}* at the start of your response.`;
    bot.say('markdown', surveycovidmsg)
    
      .then(() => getcovidsurvey(bot));
    //bot.reply(trigger.message);
  });
  
  
  function getcovidsurvey() {
    responded = true;
    console.log("this is inside getsurvey func.");
    framework.hears(/[1-9][0-9]/i, function (bot, trigger) {
      console.log("inside getcovidsurvey");
      responded = true;
      var usersurvey = trigger.text
      var usersurveyStr = JSON.stringify(usersurvey)
      var usersurveyObj = JSON.parse(usersurveyStr)
      let newusersurveystr = usersurveyObj.substring(7)
      //console.log("user search for: " + trigger.text + " ||" + newusersearchstr )
      responded = true;
      //bot.reply(trigger.message, 'Searching for product...','markdown');
      //read damn message input and write param inside where
      Survey.findAll({
        where: {
          csurcode: newusersurveystr
        }, raw: true
      }).then((covid) => {
  
        console.log("in survey then")
        covid.forEach(surveyobj => {
          console.log("inresponse forloop")
          if (surveyobj.csurcode != null) {
            console.log("inresponse notnull")
            console.log("survey: " + survey)
            console.log("surveyobj: " + surveyobj + " , " + surveyobj.asurcode)
  
            //i++ //increment message is a dog
            //let fbresponsemsg = `**RESPONSE:**`;
            let usersurveystr = "Respondent: " + surveyobj.aname + " (" + surveyobj.cemail + ")" +
              " \nAnswers for..." +
              " \nQ1. " + surveyobj.cq1 +
              " \nQ2. " + surveyobj.cq2 +
              " \nQ3. " + surveyobj.cq3 +
              " \nQ4. " + surveyobj.cq4 +
              " \nQ5. " + surveyobj.cq5
            bot.say("RESPONSE: " + usersurveystr);
          } else {
            console.log("inresponse else")
            bot.say("No responses for survey #" + newusersearchstr + " yet.");
          }
        })
      }).catch(err => console.log(err));
    });
  
  }